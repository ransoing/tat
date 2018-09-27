import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AboutTatComponent, RecommendedBooksComponent, HumanTraffickingLawsComponent, VideosComponent } from '../../modals/';
import { ModalService } from '../../services';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
})
export class ResourcesPage implements OnInit {

  constructor( public modalService: ModalService, public navCtrl: NavController ) { }

  AboutTatComponent = AboutTatComponent;
  RecommendedBooksComponent = RecommendedBooksComponent;
  HumanTraffickingLawsComponent = HumanTraffickingLawsComponent;
  VideosComponent = VideosComponent;

  ngOnInit() {
  }

}
