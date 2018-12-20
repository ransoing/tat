import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen
  ) { }

  onSetLanguage() {
    this.translate.use( this.settings.language );
  }

  showSplash() {
    this.splashScreen.show();
    setTimeout( () => {
      this.splashScreen.hide();
    }, 10000 );
  }

  ngOnInit() {
    console.log('abcdefg: homepage onInit' );
  }
}
