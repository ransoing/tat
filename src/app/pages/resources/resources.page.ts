import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  AboutTatComponent,
  RecommendedBooksComponent,
  HumanTraffickingLawsComponent,
  PodcastsComponent,
  VideosComponent
} from '../../modals/';
import { ModalService } from '../../services';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {

  constructor(
    public modalService: ModalService,
    public navCtrl: NavController,
    private _analyticsService: AnalyticsService
  ) { }

  AboutTatComponent = AboutTatComponent;
  RecommendedBooksComponent = RecommendedBooksComponent;
  HumanTraffickingLawsComponent = HumanTraffickingLawsComponent;
  VideosComponent = VideosComponent;
  PodcastsComponent = PodcastsComponent;

  ngOnInit(): void {
    this._analyticsService.logPageView( 'Resources' );
  }

}
