import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet, AlertController, NavController } from '@ionic/angular';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService, UserDataService, TrxService } from './services';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginComponent, SurveyComponent } from './modals-volunteer';
import { SurveyService } from './services/surveys.service';
import { VolunteerType, UserDataRequestFlags } from './models/user-data';
import { NotificationType, INotificationData } from './models/notification';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // get a reference to the IonRouterOutlet element
  @ViewChild( IonRouterOutlet ) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private settings: SettingsService,
    private angularFireAuth: AngularFireAuth,
    private modalService: ModalService,
    private miscService: MiscService,
    private userDataService: UserDataService,
    private alertCtrl: AlertController,
    private trx: TrxService,
    private surveys: SurveyService,
    private navCtrl: NavController,
    private firebase: FirebaseX,
    private router: Router
  ) {
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.statusBar.overlaysWebView( false ); // @@TODO test to make sure this looks fine in android. It may do nothing in ios.
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

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
        // wait up to 10 seconds for a login to happen before handling the notification
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


    // configure translations
    this.settings.waitForReady().then( () => {
      this.translate.setDefaultLang( this.settings.language );
      this.translate.use( this.settings.language );
    });

    // configure behavior for when the user logs in/out
    // this observable will fire when the app starts up, so it's not just when the user has actively logged in or out
    let firstAuthCallback = true;
    this.angularFireAuth.authState.subscribe( async response => {
      this.miscService.isLoggedIn = !!response;
      if ( response ) {
        // logged in.
        // save the firebase user object and fetch the user's data from the proxy
        this.userDataService.firebaseUser = response;
        // don't show a 'please wait' popup if the user is on the home screen, because this stalls the user
        // right when the app is launched, if the user is already logged in
        const showLoading = this.router.url !== '/tabs/(home:home)';
        this.userDataService.fetchUserData( true, UserDataRequestFlags.ALL, showLoading );

        // ask for permission to receive notifications, if we don't have permissions
        if ( (!await this.firebase.hasPermission()) ) {
          this.firebase.grantPermission();
        }
      } else {
        // logged out.
        this.userDataService.clearData();
        // only redirect the user and notify that he has logged out if this isn't executed on application launch
        if ( !firstAuthCallback ) {
          // kick the user to the homepage and close the current modal
          // (it would be better to first check if the user is on a restricted page)
          this.miscService.goBackHome();
          // tell the user that he has logged out
          this.showLogoutNotice();
        }
      }
      firstAuthCallback = false;
    });

    // when a user has logged into firebase but has no salesforce entry, pop up the new user signup form
    this.userDataService.newUserDetected.subscribe( async () => {
      this.modalService.open( SurveyComponent, {
        titleTranslationKey: 'volunteer.forms.signup.title',
        survey: await this.surveys.signupSurvey(),
        onSuccess: async() => {
          // new user successfully registered. Get the user data and redirect to the volunteer page.
          this.userDataService.fetchUserData( true );
          this.navCtrl.navigateRoot( '/tabs/(volunteer:volunteer)' );
        }
      });
    });

    // if the app was on the login modal when it was last closed, open that modal now
    if ( localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) ) {
      this.modalService.open( LoginComponent );
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
