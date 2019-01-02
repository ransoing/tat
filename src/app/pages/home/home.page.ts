import { Component, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen,
    public angularFireAuth: AngularFireAuth
  ) {}

  onSetLanguage() {
    this.translate.use( this.settings.language );
  }

  ngAfterViewInit() {
    setTimeout( () => this.splashScreen.hide(), 300 );
  }

  authSuccessCallback( evt ) {
    console.log( 'homepage auth success', evt );
  }

  authErrorCallback( evt ) {
    console.log( 'homepage auth error', evt );
  }

  logout() {
    console.log( '@handleOpenURL', window['handleOpenURL'] );
    
    this.angularFireAuth.auth.signOut();
  }
}
