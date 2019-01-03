import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { MiscService, TrxService } from '../../services';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  public static LOGIN_REDIRECT_URL_KEY: 'loginRedirectUrl';

  public modal: HTMLIonModalElement;
  
  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private miscService: MiscService,
    private trx: TrxService
  ) { }

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
    // if the redirect URL isn't set, set it now
    if ( !localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) ) {
      localStorage.setItem( LoginComponent.LOGIN_REDIRECT_URL_KEY, this.miscService.loginRedirectUrl );
    }
  }

  ngOnDestroy() {
    localStorage.removeItem( LoginComponent.LOGIN_REDIRECT_URL_KEY );
  }


  authSuccessCallback( evt ) {
    // go to the restricted page which the user initially tried to go to before logging in
    this.navCtrl.navigateRoot( localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) )
    .then( () => this.modal.dismiss() );
  }

  authErrorCallback( evt ) {
    console.error( 'login auth error', evt );
  }

}
