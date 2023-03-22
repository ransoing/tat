import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalService, MiscService, SettingsService } from '../../services';
import {
  GenericModalComponent
} from '../../modals';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-red-flags-labor',
  templateUrl: './red-flags-labor.page.html',
  styleUrls: ['./red-flags-labor.page.scss'],
})
export class RedFlagsLaborPage implements OnInit {

  GenericModalComponent = GenericModalComponent;

  caseStudyAProps = {
    title: 'redFlagsSex.caseStudy.title',
    bodyHtml: 'redFlagsLabor.caseStudy.a',
    source: {
      label: 'redFlagsLabor.caseStudy.source.sanAntonio',
      link: 'https://www.expressnews.com/news/local/politics/article/Tricked-and-brutalized-farmworkers-face-a-battle-13829867.php'
    }
  }

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public miscService: MiscService,
    public settings: SettingsService,
    private _analyticsService: AnalyticsService
  ) { }

  ngOnInit(): void {
    this._analyticsService.logPageView( 'Labor Trafficking Red Flags' );
  }
}
