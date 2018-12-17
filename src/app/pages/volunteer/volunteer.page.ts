import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VolunteerResourcesComponent, HoursLogComponent, FeedbackComponent, PhotosComponent, PostOutreachSelectionComponent, VolunteerSettingsComponent, TrainingVideoComponent } from '../../modals';
import { ModalService, UserDataService } from '../../services';

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

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService
  ) {}

}
