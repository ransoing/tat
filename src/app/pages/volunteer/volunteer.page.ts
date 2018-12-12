import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VolunteerResourcesComponent, HoursLogComponent, FeedbackComponent, PhotosComponent, PostOutreachSelectionComponent, VolunteerSettingsComponent } from '../../modals';
import { ModalService, UserDataService } from '../../services';

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
  private PostOutreachSelectionComponent = PostOutreachSelectionComponent;
  private VolunteerSettingsComponent = VolunteerSettingsComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService
  ) {}

  ngOnInit() {
  }

}
