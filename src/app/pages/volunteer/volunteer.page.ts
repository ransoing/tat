import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  PostOutreachSelectionComponent, HoursLogComponent, 
  VolunteerResourcesComponent, VolunteerSettingsComponent, TrainingVideoComponent
} from '../../modals';
import {
  FeedbackFormComponent, PreOutreachFormComponent
} from '../../modals-forms';
import { ModalService, UserDataService, MiscService } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage {

  public VolunteerResourcesComponent = VolunteerResourcesComponent;
  public HoursLogComponent = HoursLogComponent;
  public FeedbackFormComponent = FeedbackFormComponent;
  public PostOutreachSelectionComponent = PostOutreachSelectionComponent;
  public VolunteerSettingsComponent = VolunteerSettingsComponent;
  public TrainingVideoComponent = TrainingVideoComponent;
  public PreOutreachFormComponent = PreOutreachFormComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService,
    public angularFireAuth: AngularFireAuth,
    private miscService: MiscService
  ) {
    this.miscService.onRouteHere(() => {
      this.userDataService.fetchUserData();
    });
  }

}
