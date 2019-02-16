import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService, UserDataService, TrxService, StorageKeys } from './services';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginComponent } from './modals';

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
    private trx: TrxService
  ) {
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang( this.settings.language );
      this.translate.use( this.settings.language );

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

      // if the app was on the login modal when it was last closed, open that modal now
      if ( localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) ) {
        this.modalService.open( LoginComponent );
      }
    });
  }

  async showLogoutNotice() {
    let alert = await this.alertCtrl.create({
      message: await this.trx.t( 'misc.logoutMessage' ),
      buttons: [await this.trx.t( 'misc.close' )]
    });
    alert.present();
  }

}
