import { Component, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService, UserDataService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { environment } from '../../../environments/environment';
import { AppMode } from '../../models/app-mode';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {

  simdata;

  environment = environment;
  AppMode = AppMode;

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen,
    private userDataService: UserDataService
  ) {}

  onSetLanguage() {
    this.translate.use( this.settings.language );
    this.settings.saveSettings();
    // update the user's notification language preference
    if ( this.miscService.isLoggedIn ) {
      this.userDataService.updateNotificationPreferences( { language: this.settings.language }, false );
    }
  }

  ngAfterViewInit() {
    setTimeout( () => this.splashScreen.hide(), 300 );
  }
}
