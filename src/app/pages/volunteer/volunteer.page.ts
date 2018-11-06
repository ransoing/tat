import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VolunteerResourcesComponent, HoursLogComponent } from '../../modals';
import { ModalService } from '../../services';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage implements OnInit {

  VolunteerResourcesComponent = VolunteerResourcesComponent;
  HoursLogComponent = HoursLogComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService
  ) { }

  ngOnInit() {
  }

}
