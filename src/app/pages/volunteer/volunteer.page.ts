import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  PostOutreachSelectionComponent, HoursLogComponent, 
  VolunteerResourcesComponent, VolunteerSettingsComponent, TrainingVideoComponent,
  GetFeedbackSurveyComponent
} from '../../modals-volunteer';
import { ModalService, UserDataService, MiscService, GetFeedbackService, UserDataRequestFlags } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage {

  public VolunteerResourcesComponent = VolunteerResourcesComponent;
  public HoursLogComponent = HoursLogComponent;
  public PostOutreachSelectionComponent = PostOutreachSelectionComponent;
  public VolunteerSettingsComponent = VolunteerSettingsComponent;
  public TrainingVideoComponent = TrainingVideoComponent;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService,
    public angularFireAuth: AngularFireAuth,
    private miscService: MiscService,
    private getFeedbackService: GetFeedbackService
  ) {
    this.miscService.onRouteHere(() => {
      this.userDataService.fetchUserData();
    });
  }

  showFeedbackForm() {
    this.modalService.open( GetFeedbackSurveyComponent, {
      titleTranslationKey: 'volunteer.forms.feedback.title',
      successTranslationKey: 'volunteer.forms.feedback.submitSuccess',
      surveyUrl: this.getFeedbackService.getTestimonialFeedbackSurveyUrl(),
      onSurveyFinished: () => {}
    });
  }

  showPreOutreachForm() {
    this.modalService.open( GetFeedbackSurveyComponent, {
      titleTranslationKey: 'volunteer.forms.preOutreach.title',
      successTranslationKey: 'volunteer.forms.preOutreach.submitSuccess',
      surveyUrl: this.getFeedbackService.getPreOutreachSurveyUrl(),
      onSurveyFinished: () => {
        this.getFeedbackService.waitForSalesforceToUpdate()
        .then( () => {
          // update just the unfinished outreach targets in the user data
          this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS );
        });
      }
    });
  }

}
