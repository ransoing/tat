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

  private VolunteerResourcesComponent = VolunteerResourcesComponent;
  private HoursLogComponent = HoursLogComponent;
  private FeedbackComponent = FeedbackComponent;
  private PhotosComponent = PhotosComponent;
  private PostOutreachSelectionComponent = PostOutreachSelectionComponent;
  private VolunteerSettingsComponent = VolunteerSettingsComponent;
  private TrainingVideoComponent = TrainingVideoComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService
  ) {}

}
