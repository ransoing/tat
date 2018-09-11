import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ModalService } from '../../services';
import { CaseStudyAComponent, CaseStudyBComponent, CaseStudyCComponent, CaseStudyDComponent } from '../../modals';

@Component({
  selector: 'app-red-flags',
  templateUrl: './red-flags.page.html',
  styleUrls: ['./red-flags.page.scss'],
})
export class RedFlagsPage implements OnInit {

  CaseStudyAComponent = CaseStudyAComponent;
  CaseStudyBComponent = CaseStudyBComponent;
  CaseStudyCComponent = CaseStudyCComponent;
  CaseStudyDComponent = CaseStudyDComponent;

  constructor( public navCtrl: NavController, public modalService: ModalService ) { }

  ngOnInit() {
  }

}
