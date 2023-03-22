import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService, UserDataService, ModalService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { environment } from '../../../environments/environment';
import { AppMode } from '../../models/app-mode';
import { AboutTatComponent } from '../../modals';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit, OnInit {

  simdata;

  environment = environment;
  AppMode = AppMode;
  AboutTatComponent = AboutTatComponent;

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen,
    public modalService: ModalService,
    private userDataService: UserDataService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.analyticsService.logPageView( 'Home' );
  }

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
