import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService, UserDataService, TrxService } from './services';
import { AngularFireAuth } from '@angular/fire/auth';
import { skip } from 'rxjs/operators';
import { LoginComponent, SurveyComponent } from './modals-volunteer';
import { SurveyService } from './services/surveys.service';
import { VolunteerType, UserDataRequestFlags } from './models/user-data';
import { NotificationType, INotificationData } from './models/notification';
import { environment } from '../environments/environment';
import { AppMode, BuildTarget } from './models/app-mode';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // get a reference to the IonRouterOutlet element
  @ViewChild( IonRouterOutlet, {static: false} ) routerOutlet: IonRouterOutlet;

  private readonly doNotShowContentWarningStorageKey = 'doNotShowContentWarning';

  constructor(
    public miscService: MiscService,
    private platform: Platform,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private settings: SettingsService,
    private angularFireAuth: AngularFireAuth,
    private modalService: ModalService,
    private userDataService: UserDataService,
    private alertCtrl: AlertController,
    private trx: TrxService,
    private surveys: SurveyService,
    private navCtrl: NavController,
    private firebase: FirebaseX,
    private splash: SplashScreen,
    private router: Router,
    private storage: Storage
  ) {
    if ( environment.app === AppMode.ELD ) {
      // for ELD mode, change the content security policy to be super restrictive, so it won't load anything from external servers.
      // this should be done before anything else happens
      const cspMetaTag = Array.from( document.head.querySelectorAll('meta') ).find(
        ( tag: HTMLMetaElement ) => tag.getAttribute( 'http-equiv' ) === 'Content-Security-Policy'
      );
      if ( cspMetaTag != null ) {
        cspMetaTag.setAttribute( 'content', `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: gap: ws://*` );
      }
      // turn off Firebase plugin reporting
      firebase.setAnalyticsCollectionEnabled( false );
      firebase.setPerformanceCollectionEnabled( false );
      firebase.setCrashlyticsCollectionEnabled( false );
    }
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.statusBar.overlaysWebView( false );
    this.initializeApp();
  }

  async initializeApp() {
    // set a class on the body to override styles for the web version
    if ( environment.buildTarget === BuildTarget.WEB ) {
      document.body.classList.add( 'build-target-web' );
    }

    await this.platform.ready();

    // @@ fix back button behavior on android
    try {
      document.addEventListener( 'backbutton', () => {} );
      this.platform.backButton.subscribe(() => {} );
      this.platform.backButton.subscribeWithPriority( 0, () => {
        this.navCtrl.back();
      });
    } catch (error) {}

    setTimeout( () => this.splash.hide(), 5000 ); // in case the home.page fails to hide the splash

    // wait one second before triggering the content warning
    setTimeout( () => this.triggerContentWarning(), 1000 );

    // configure translations
    this.settings.waitForReady().then( () => {
      this.translate.setDefaultLang( 'en' );
      // wait until the most recent translations have loaded (or timed out) before we show the app content.
      // Otherwise, the user will see the translation keys, like `home.buttonLabels.redFlags`
      this.translate.use( this.settings.language ).toPromise().then( () => this.miscService.languageLoaded = true );
    });

    if ( environment.app === AppMode.TAT ) {
      this.initializeAppTatOnlyFeatures();
    }
  }

  /** Initializes many things, but intended only for the TAT app, and not for the ELD app */
  async initializeAppTatOnlyFeatures() {
    // if cordova is not available, this is a dev machine. Overload some functions that don't work in a dev environment
    if ( !window.cordova ) {
      this.firebase.getToken = () => Promise.resolve( 'Computer dev user' );
    }

    // listen for when a notification is received
    this.firebase.onMessageReceived().subscribe( message => {
      // do something only when the notification is tapped on.
      // (this observable also triggers when the notification is simply received.)
      if ( !message.tap ) {
        return;
      }
      // the message data may be stringified JSON
      if ( typeof message.data === 'string' ) {
        message.data = JSON.parse( message.data );
      }
      // there are 3 possibilities of the current state when the notification was tapped:
      // 1. The app was in the foreground (it was the active app)
      // 2. The app was running in the background, and was just brought to the foreground
      // 3. The app was launched as a result of the notification tap
      // Thus, the user may or may not be logged in.
      if ( this.miscService.isLoggedIn ) {
        this.handleNotificationTapped( message.data );
      } else {
        // go to the volunteer page to trigger the login modal,
        // then wait up to 10 seconds for a login to happen before handling the notification
        this.navCtrl.navigateRoot( '/tabs/(volunteer:volunteer)' );
        let subTimeout;
        const subscription = this.angularFireAuth.authState.subscribe( async response => {
          // user is logged in if `response` evaluates to true
          if ( response ) {
            this.handleNotificationTapped( message.data );
            subscription.unsubscribe();
            clearTimeout( subTimeout );
          }
        });
        subTimeout = setTimeout( () => subscription.unsubscribe(), 10000 );
      }
    });

    // configure behavior for when the user logs out
    // Behavior for logging in is defined in login.component
    // this observable will fire when the app starts up, so it's not just when the user has actively logged in or out
    this.angularFireAuth.authState.subscribe( async response => {
      if ( !response ) {
        // logged out.
        this.miscService.isLoggedIn = false;
        this.userDataService.clearData();
      }
    });
    // except for the first authState change when the app loads, redirect a logged out user to the home page
    this.angularFireAuth.authState.pipe( skip(1) ).subscribe( async response => {
      if ( !response ) {
        // only redirect the user and notify that he has logged out if he isn't already on the home page
        if ( ['/tabs/home', '/', ''].indexOf(this.router.url) === -1 ) {
          // kick the user to the homepage and close the current modal
          // (it would be better to first check if the user is on a restricted page)
          this.miscService.goBackHome();
          // tell the user that he has logged out
          this.showLogoutNotice();
        }
      }
    });

    // when a user has logged into firebase but has no salesforce entry, pop up the new user signup form
    this.userDataService.newUserDetected.subscribe( async () => {
      // don't open the signup form when the user is on the home page... this shouldn't happen anyway, but some users report
      // that it does happen.
      if ( ['/tabs/home', '/', ''].indexOf(this.router.url) === -1 ) {
        this.modalService.open( SurveyComponent, {
          titleTranslationKey: 'volunteer.forms.signup.title',
          survey: await this.surveys.signupSurvey(),
          onSuccess: async() => {
            // new user successfully registered. Get the user data and redirect to the volunteer page.
            this.userDataService.fetchUserData( true );
            this.navCtrl.navigateRoot( '/tabs/volunteer' );
          }
        });
      }
    });

    // if the user was signing into a federated identity provider when the app was last closed,
    // attempt to go to the restricted page that the user initially tried to navigate to, which will open the login modal
    // and complete the sign-in process
    const redirectUrl = localStorage.getItem( LoginComponent.LOGIN_REDIRECT_URL_KEY );
    if ( redirectUrl ) {
      localStorage.removeItem( LoginComponent.LOGIN_REDIRECT_URL_KEY );
      this.navCtrl.navigateRoot( redirectUrl );
    }
  }

  async triggerContentWarning() {
    await this.miscService.waitForLanguageLoaded();
    const avoidWarning = await this.storage.get( this.doNotShowContentWarningStorageKey );
    if (
      !avoidWarning &&
      (
        // show the warning on any page when hosted as a web site; otherwise show the warning only on the home page
        environment.buildTarget === BuildTarget.WEB ||
        environment.buildTarget === BuildTarget.MOBILE && ['/tabs/home', '/', ''].includes( this.router.url )
      )
    ) {
      const alert = await this.alertCtrl.create({
        message: await this.trx.t( 'home.contentWarning' ),
        buttons: [{
          text: await this.trx.t( 'misc.buttons.doNotShow'),
          handler: () => {
            // save to storage that we should avoid this warning
            this.storage.set( this.doNotShowContentWarningStorageKey, true );
          }
        }, {
          text: await this.trx.t( 'misc.buttons.continue'),
          role: 'cancel'
        }]
      });
      alert.present();
    }
  }

  async showLogoutNotice() {
    const alert = await this.alertCtrl.create({
      message: await this.trx.t( 'misc.messages.logoutMessage' ),
      buttons: [await this.trx.t( 'misc.buttons.close' )]
    });
    alert.present();
  }

  private async handleNotificationTapped( messageData: INotificationData ) {
    if ( messageData && messageData.type === NotificationType.OUTREACH_LOCATION ) {
      // get user data before handling this notification
      await this.userDataService.fetchUserData( true );
      // the notification contains the salesforce ID of the location.
      // Verify that this ID corresponds with a location
      const outreachLocation = this.userDataService.data.outreachLocations.find( location => messageData.salesforceId === location.id );
      if ( outreachLocation ) {
        // open a modal to fill out the report
        if ( this.userDataService.data.volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR ) {
          // for truck stop volunteers
          this.modalService.open( SurveyComponent, {
            titleTranslationKey: 'volunteer.forms.postOutreach.title',
            successTranslationKey: 'volunteer.forms.postOutreach.submitSuccess',
            survey: await this.surveys.postOutreachSurvey( outreachLocation ),
            onSuccess: () => {
              // update just the unfinished activities in the user data
              this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
            }
          });
        }
      }
    } else {
      // for other volunteers @@ . check to see if it's the notification type for events
    }
  }

}
