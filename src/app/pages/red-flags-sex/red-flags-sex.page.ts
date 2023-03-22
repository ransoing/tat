import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RedFlagsSexLocalComponent, RedFlagsSexMoversComponent, RedFlagsSexOtrComponent } from '../../modals';
import { MiscService, ModalService, SettingsService } from '../../services';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-red-flags-sex',
  templateUrl: './red-flags-sex.page.html',
  styleUrls: ['./red-flags-sex.page.scss'],
})
export class RedFlagsSexPage {

  RedFlagsSexOtrComponent = RedFlagsSexOtrComponent;
  RedFlagsSexLocalComponent = RedFlagsSexLocalComponent;
  RedFlagsSexMoversComponent = RedFlagsSexMoversComponent;

  constructor(
    public navCtrl: NavController,
    public miscService: MiscService,
    public settings: SettingsService,
    public modalService: ModalService,
    private _analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this._analyticsService.logPageView( 'Sex Trafficking Red Flags' );
  }
}
