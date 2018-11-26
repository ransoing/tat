import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VolunteerResourcesComponent, HoursLogComponent, FeedbackComponent, PhotosComponent } from '../../modals';
import { ModalService } from '../../services';

//import * as jsforce from 'jsforce';
import { Rest } from 'ts-force';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage implements OnInit {

  private VolunteerResourcesComponent = VolunteerResourcesComponent;
  private HoursLogComponent = HoursLogComponent;
  private FeedbackComponent = FeedbackComponent;
  private PhotosComponent = PhotosComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService
  ) {
    //console.log( window['jsforce'] );
    console.log( Rest );
  }

  ngOnInit() {
  }

}
