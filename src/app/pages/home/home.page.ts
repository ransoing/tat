import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    private translate: TranslateService,
    private settings: SettingsService
  ) { }

  showLanguages() {
    // @@TODO: show a choice between the two languages rather than toggling
    this.settings.language = this.settings.language === 'en' ? 'es' : 'en';
    this.translate.use( this.settings.language );
  }
}
