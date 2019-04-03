import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService, UserDataService, TrxService } from './services';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginComponent, NewUserComponent, SurveyComponent } from './modals-volunteer';
import { ISurvey, ISurveyFieldType } from './modals-volunteer/survey/survey.component';
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
    private surveys: SurveyService
  ) {
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
      // this.userDataService.newUserDetected.subscribe( () => {
      //   this.modalService.open( NewUserComponent );
      // });
      // @@ uncomment the above and destroy the below to return to normal
      // let survey: ISurvey = {
      //   pages: [{
      //     topTextTranslationKey: 'redFlags.title',
      //     fields: [{
      //       type: ISurveyFieldType.TEXT,
      //       name: 'test',
      //       labelTranslationKey: 'volunteer.btns.resources'
      //     }, {
      //       type: ISurveyFieldType.EMAIL,
      //       name: 'test2',
      //       labelTranslationKey: 'volunteer.btns.resources',
      //       isRequired: true
      //     }, {
      //       type: ISurveyFieldType.SELECT,
      //       name: 'test3',
      //       labelTranslationKey: 'volunteer.btns.resources',
      //       isRequired: true,
      //       options: [
      //         { value: 'one', labelTranslationKey: 'misc.submit' },
      //         { value: 'two', labelTranslationKey: 'misc.success' }
      //       ]
      //     }]
      //   }, {
      //     isVisible: (fields) => fields.test === 'sample',
      //     topTextTranslationKey: 'volunteer.forms.signup.intro',
      //     fields: [{
      //       type: ISurveyFieldType.CHOICE,
      //       name: 'p2test',
      //       labelTranslationKey: 'volunteer.btns.resources',
      //       isRequired: true,
      //       options: [
      //         { value: 'yes', labelTranslationKey: 'misc.yes' },
      //         { value: 'no', labelTranslationKey: 'misc.no' }
      //       ]
      //     }]
      //   }, {
      //     fields: [{
      //       type: ISurveyFieldType.TEXT,
      //       name: 'p3test',
      //       labelTranslationKey: 'volunteer.btns.resources',
      //       isRequired: true
      //     }]
      //   }],
      //   onComplete: () => {}
      // };
      setTimeout( () => {
        this.modalService.open( SurveyComponent, {
          titleTranslationKey: 'volunteer.forms.signup.title',
          survey: this.surveys.hoursLogSurvey
        });
      }, 1000 );

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
