import { Component, AfterViewInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { MiscService, SettingsService, TrxService, UserDataService } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Storage } from '@ionic/storage';
import { UserDataRequestFlags } from '../../models/user-data';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  public static LOGIN_REDIRECT_URL_KEY = 'loginRedirectUrl';

  @ViewChild( 'firebaseUi', { static: true, read: ViewContainerRef } ) firebaseUi: ViewContainerRef;

  public modal: HTMLIonModalElement;
  private authSubscriber: Subscription;
  private readonly doNotShowNoticeStorageKey = 'doNotShowVolunteerNotice';

  constructor(
    private navCtrl: NavController,
    private miscService: MiscService,
    private trx: TrxService,
    private angularFireAuth: AngularFireAuth,
    private alertController: AlertController,
    private userDataService: UserDataService,
    private firebase: FirebaseX,
    private storage: Storage,
    public settings: SettingsService
  ) {}

  /*
   * The firebase login widget doesn't work quite right, because ionic serves the app from `http:` instead of from
   * `file:` (which is how other cordova apps are served). This makes the firebase library think that the code is
   * running from a webpage rather than from an app, and quirks ensue.
   *
   * When the firebase login process redirects back to the app after authorizing with a third party auth provider,
   * the app starts back up from scratch. The firebase login widget on the login page needs to initialize after the
   * redirect so it can contact firebase to confirm that the user is logged in. To achieve this, we set a value
   * on localStorage which persists through app reboot. The value just keeps track of whether the user was on the
   * login page when the app was closed.
   * When the app starts up (in app.component.ts), it checks the localStorage variable -- if it's present, it opens
   * the login modal, and the firebase login widget initializes and confirms that the user has logged in successfully.
   */

  ngAfterViewInit() {
    const modalHasPresented = new Promise( resolve => {
      this.modal.addEventListener( 'ionModalDidPresent', () => resolve() );
    });

    this.triggerNotice();

    // listen to when the user has clicked one of the login buttons that takes him away from the app. We don't have a way
    // to know when the FirebaseUI widget has finished initializing, so we must poll to find when the buttons exist, so
    // we can add an event listener on them.
    const loginButtonInterval = setInterval( () => {
      const query = '.firebaseui-list-item > .firebaseui-idp-button:not(.firebaseui-idp-password)';
      const federatedButtons = this.firebaseUi.element.nativeElement.querySelectorAll( query );
      if ( federatedButtons.length > 0 ) {
        clearInterval( loginButtonInterval );
        federatedButtons.forEach( button => {
          // when the user clicks one of these, save the redirect URL before the click event on the widget exits the app
          button.addEventListener( 'click', () => {
            // if the redirect URL isn't set, set it now
            if ( !localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) ) {
              localStorage.setItem( LoginComponent.LOGIN_REDIRECT_URL_KEY, this.miscService.loginRedirectUrl );
            }
          });
        });
      }
    }, 100 );


    this.authSubscriber = this.angularFireAuth.authState.subscribe( async( response ) => {
      if ( !!response ) {
        // even though this flag is set elsewhere, make sure this flag is set to true before we try to navigate
        this.miscService.isLoggedIn = true;

        // save the firebase user object and fetch the user's data from the proxy
        this.userDataService.firebaseUser = response;
        this.userDataService.fetchUserData( true, UserDataRequestFlags.ALL );

        // ask for permission to receive notifications, if we don't have permissions
        this.firebase.hasPermission().then( hasPermission => {
          if ( !hasPermission ) {
            this.firebase.grantPermission();
          }
        });

        // go to the restricted page which the user initially tried to go to before logging in
        this.navCtrl.navigateRoot( localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) || this.miscService.loginRedirectUrl )
        .then( async() => {
          await modalHasPresented;
          this.modal.dismiss();
        });
      }
    });
  }

  async triggerNotice() {
    // show a notice, unless the user has chosen not to see the notice
    const avoidNotice = await this.storage.get( this.doNotShowNoticeStorageKey );
    if ( !avoidNotice ) {
      const alert = await this.alertController.create({
        cssClass: 'volunteer-notice',
        message: await this.trx.t( 'volunteer.notice' ),
        buttons: [{
          text: await this.trx.t( 'misc.buttons.doNotShow'),
          handler: () => {
            // save to storage that we should avoid this notice
            this.storage.set( this.doNotShowNoticeStorageKey, true );
          }
        }, {
          text: await this.trx.t( 'misc.buttons.continue'),
          role: 'cancel'
        }]
      });
      alert.present();
    }
  }

  ngOnDestroy() {
    localStorage.removeItem( LoginComponent.LOGIN_REDIRECT_URL_KEY );
    this.authSubscriber.unsubscribe();
  }


  authSuccessCallback( evt ) {
    // do nothing. This is handled in the observable subscription
  }

  authErrorCallback( evt ) {
    console.error( 'login auth error', evt );
  }

}
