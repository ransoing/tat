import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, ModalService, MiscService } from './services';
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
    private miscService: MiscService
  ) {
    this.statusBar.styleBlackOpaque();
    this.statusBar.show();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang( this.settings.language );
      this.translate.use( this.settings.language );

      // @@set language of firebase login
      this.angularFireAuth.authState.subscribe( response => {
        this.miscService.isLoggedIn = !!response;
        if ( response ) {
          console.log( "login data: ", response );
          // @@ get the idToken before every request to the proxy?
          response.getIdToken().then( token => console.log("Auth token:", token) );
          // @@ do something when logged in
        } else {
          // @@ do something when logged out
        }
      });

      // if the app was on the login modal when it was last closed, open that modal now
      if ( localStorage.getItem(LoginComponent.LOGIN_REDIRECT_URL_KEY) ) {
        this.modalService.open( LoginComponent );
      }
    });
  }

}
