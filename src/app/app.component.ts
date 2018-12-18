import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  // get a reference to the IonRouterOutlet element
  @ViewChild( IonRouterOutlet ) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private settings: SettingsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang( this.settings.language );
      this.translate.use( this.settings.language );
    });
  }

  ngOnInit() {
    this.splashScreen.hide();
    this.statusBar.styleDefault();
    this.statusBar.show();
  }
}
