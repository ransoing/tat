import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController, NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService, UserDataService, TrxService } from './services';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginComponent, SurveyComponent } from './modals-volunteer';
import { SurveyService } from './services/surveys.service';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { VolunteerType, UserDataRequestFlags } from './models/user-data';
import { NotificationType } from './models/notification';

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
    private notifications: LocalNotifications
  ) {
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // configure notification defaults
    this.notifications.setDefaults({
      color: '#000000',
      smallIcon: 'res://n_icon.png', // only applies to android
      foreground: true
    });

    // clear all notifications and cancel the ones that are scheduled for a date in the past
    this.notifications.clearAll();
    this.miscService.cancelNotificationIf( notification => {
      return notification.trigger && notification.trigger.at && new Date(notification.trigger.at) < new Date()
    });

    // listen for when a notification is tapped on
    this.notifications.on( 'click' ).subscribe( async notification => {
      // this will fire when the app starts up because of a clicked notification, and it will fire when the app is
      // switched to because of a clicked notification, or even when the app is already active and a notification is clicked.
      if ( this.miscService.isLoggedIn ) {
        this.handleNotificationTapped( notification );
      } else {
        // wait up to 10 seconds for a login to happen before handling the notification
        const subscription = this.angularFireAuth.authState.subscribe( async response => {
          // user is logged in if `response` evaluates to true
          if ( response ) this.handleNotificationTapped( notification );
        });
        setTimeout( () => subscription.unsubscribe(), 10000 );
      }
    });
    
    // configure translations
    this.settings.waitForReady().then( () => {
      this.translate.setDefaultLang( this.settings.language );
      this.translate.use( this.settings.language );
    });

    // configure behavior for when the user logs in/out
    // this observable will fire when the app starts up, so it's not just when the user has actively logged in or out
    var firstAuthCallback = true;
    this.angularFireAuth.authState.subscribe( response => {
      this.miscService.isLoggedIn = !!response;
      if ( response ) {
        // logged in.
        // save the firebase user object and fetch the user's data from the proxy
        this.userDataService.firebaseUser = response;
        this.userDataService.fetchUserData();
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
        onSuccess: () => {
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
    let alert = await this.alertCtrl.create({
      message: await this.trx.t( 'misc.messages.logoutMessage' ),
      buttons: [await this.trx.t( 'misc.buttons.close' )]
    });
    alert.present();
  }

  private async handleNotificationTapped( notification: ILocalNotification ) {
    if ( notification.data && notification.data.type === NotificationType.UNFINISHED_ACTIVITY ) {
      // get user data before handling this notification
      await this.userDataService.fetchUserData();
      // the notification contains the salesforce ID of the unfinished activity.
      // Verify that this ID corresponds with an unfinished activity
      const unfinishedActivity = this.userDataService.data.unfinishedActivities.find( unfinished => notification.data.salesforceId === unfinished.id );
      if ( unfinishedActivity ) {
        // open a modal to fill out the report
        if ( this.userDataService.data.volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR ) {
          // for truck stop volunteers
          this.modalService.open( SurveyComponent, {
            titleTranslationKey: 'volunteer.forms.postOutreach.title',
            successTranslationKey: 'volunteer.forms.postOutreach.submitSuccess',
            survey: this.surveys.postOutreachSurvey( unfinishedActivity ),
            onSuccess: () => {
              // update just the unfinished activities in the user data
              this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
            }
          });
        } else {
          // for other volunteers @@
          // this.modalService.open( SurveyComponent, {
          //   titleTranslationKey: 'volunteer.forms.postEvent.title',
          //   successTranslationKey: 'volunteer.forms.postEvent.submitSuccess',
          //   survey: this.surveys.postEventSurvey( unfinishedActivity ),
          //   onSuccess: () => {
          //     // update just the unfinished activities in the user data
          //     this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
          //   }
          // });
        }
      }
    }
  };

}
