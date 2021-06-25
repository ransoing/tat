import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalService, MiscService, SettingsService } from '../../services';
import {
  GenericModalComponent
} from '../../modals';

@Component({
  selector: 'app-red-flags-labor',
  templateUrl: './red-flags-labor.page.html',
  styleUrls: ['./red-flags-labor.page.scss'],
})
export class RedFlagsLaborPage {

  GenericModalComponent = GenericModalComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public miscService: MiscService,
    public settings: SettingsService
  ) { }
}
