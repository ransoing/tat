import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController, NavController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService, UserDataService, TrxService } from './services';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginComponent, SurveyComponent } from './modals-volunteer';
import { SurveyService } from './services/surveys.service';

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
    private navCtrl: NavController
  ) {
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    this.settings.waitForReady().then( () => {
      this.translate.setDefaultLang( this.settings.language );
      this.translate.use( this.settings.language );
    });

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
    this.userDataService.newUserDetected.subscribe( () => {
      this.modalService.open( SurveyComponent, {
        titleTranslationKey: 'volunteer.forms.signup.title',
        // @@ add successTranslationKey
        survey: this.surveys.signupSurvey(),
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

}
