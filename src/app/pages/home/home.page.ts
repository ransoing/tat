import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, MiscService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public settings: SettingsService,
    public miscService: MiscService
  ) { }

  onSetLanguage() {
    this.translate.use( this.settings.language );
  }
}
