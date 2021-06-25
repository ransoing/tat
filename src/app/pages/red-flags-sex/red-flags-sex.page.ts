import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MiscService, SettingsService } from '../../services';

@Component({
  selector: 'app-red-flags-sex',
  templateUrl: './red-flags-sex.page.html',
  styleUrls: ['./red-flags-sex.page.scss'],
})
export class RedFlagsSexPage {

  constructor(
    public navCtrl: NavController,
    public miscService: MiscService,
    public settings: SettingsService
  ) {}
}
