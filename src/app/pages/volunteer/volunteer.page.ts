import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  PreOutreachFormComponent, PostOutreachSelectionComponent, HoursLogComponent, 
  VolunteerResourcesComponent, FeedbackComponent, PhotosComponent, 
  VolunteerSettingsComponent, TrainingVideoComponent
} from '../../modals';
import { ModalService, UserDataService, MiscService } from '../../services';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage {

  public VolunteerResourcesComponent = VolunteerResourcesComponent;
  public HoursLogComponent = HoursLogComponent;
  public FeedbackComponent = FeedbackComponent;
  public PhotosComponent = PhotosComponent;
  public PostOutreachSelectionComponent = PostOutreachSelectionComponent;
  public VolunteerSettingsComponent = VolunteerSettingsComponent;
  public TrainingVideoComponent = TrainingVideoComponent;
  public PreOutreachFormComponent = PreOutreachFormComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService,
    private miscService: MiscService
  ) {
    this.miscService.onRouteHere(() => {
      this.userDataService.fetchUserData();
    });
  }

}
