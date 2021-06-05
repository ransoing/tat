import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalService, MiscService, SettingsService } from '../../services';
import {
  CaseStudyBComponent,
  CaseStudyDComponent,
  GenericModalComponent
} from '../../modals';

@Component({
  selector: 'app-red-flags-sex',
  templateUrl: './red-flags-sex.page.html',
  styleUrls: ['./red-flags-sex.page.scss'],
})
export class RedFlagsSexPage implements OnInit {

  CaseStudyBComponent = CaseStudyBComponent;
  CaseStudyDComponent = CaseStudyDComponent;
  GenericModalComponent = GenericModalComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public miscService: MiscService,
    public settings: SettingsService,
  ) {}

  ngOnInit() {
  }

  onSetIndustry() {
    this.settings.saveSettings();
  }

}
