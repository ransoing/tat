import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalService, MiscService } from '../../services';
import {
  CaseStudyBComponent,
  CaseStudyDComponent,
  GenericModalComponent
} from '../../modals';

@Component({
  selector: 'app-red-flags-labor',
  templateUrl: './red-flags-labor.page.html',
  styleUrls: ['./red-flags-labor.page.scss'],
})
export class RedFlagsLaborPage implements OnInit {

  CaseStudyBComponent = CaseStudyBComponent;
  CaseStudyDComponent = CaseStudyDComponent;
  GenericModalComponent = GenericModalComponent;

  constructor( public navCtrl: NavController, public modalService: ModalService, public miscService: MiscService ) { }

  ngOnInit() {
  }

}
