import { Component, AfterViewInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService, TrxService } from '../../services';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit {

  private readonly doNotShowContentWarningStorageKey = 'doNotShowContentWarning';

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService,
    public splashScreen: SplashScreen,
    private trx: TrxService,
    private alertController: AlertController,
    private storage: Storage
  ) {
    // wait one second before triggering the warning
    setTimeout( () => this.triggerContentWarning(), 1000 );
  }

  async triggerContentWarning() {
    // show a content warning, unless the user has chosen not to see the warning
    const avoidWarning = await this.storage.get( this.doNotShowContentWarningStorageKey );
    if ( !avoidWarning ) {
      const alert = await this.alertController.create({
        message: await this.trx.t( 'home.contentWarning' ),
        buttons: [{
          text: await this.trx.t( 'misc.buttons.doNotShow'),
          handler: () => {
            // save to storage that we should avoid this warning
            this.storage.set( this.doNotShowContentWarningStorageKey, true );
          }
        }, {
          text: await this.trx.t( 'misc.buttons.continue'),
          role: 'cancel'
        }]
      });
      alert.present();
    }
  }

  onSetLanguage() {
    this.translate.use( this.settings.language );
    this.settings.saveSettings();
  }

  ngAfterViewInit() {
    setTimeout( () => this.splashScreen.hide(), 300 );
  }
}
