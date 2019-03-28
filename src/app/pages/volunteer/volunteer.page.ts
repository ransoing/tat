import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import {
  PostOutreachSelectionComponent, HoursLogComponent, 
  VolunteerResourcesComponent, VolunteerSettingsComponent, TrainingVideoComponent,
  GetFeedbackSurveyComponent
} from '../../modals-volunteer';
import { ModalService, UserDataService, MiscService, GetFeedbackService, UserDataRequestFlags, VolunteerType } from '../../services';
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
  public VolunteerType = VolunteerType;

  public alertIsVisible = false;
  public loadingIsVisible = false;

  constructor(
    public navCtrl: NavController,
    public modalService: ModalService,
    public userDataService: UserDataService,
    public angularFireAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private miscService: MiscService,
    private getFeedbackService: GetFeedbackService
  ) {
    this.miscService.onRouteHere(() => {
      this.userDataService.fetchUserData();
    });

    setInterval( () => {
      this.alertCtrl.getTop().then( alert => this.alertIsVisible = !!alert );
      this.loadingCtrl.getTop().then( loading => this.loadingIsVisible = !! loading );
    }, 200 );
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

  showPreEventForm() {
    // @@TODO
    // @@Also create and import PostEventSelectionComponent or make the other SelectionComponent able to handle both events and outreach targets
  }

  showTrainingVideoFeedbackForm() {
    this.modalService.open( GetFeedbackSurveyComponent, {
      titleTranslationKey: 'volunteer.forms.trainingFeedback.title',
      successTranslationKey: 'volunteer.forms.trainingFeedback.submitSuccess',
      surveyUrl: this.getFeedbackService.getTrainingVideoFeedbackSurveyUrl(),
      onSurveyFinished: () => {
        this.getFeedbackService.waitForSalesforceToUpdate()
        .then( () => {
          // update just the basic user data
          this.userDataService.fetchUserData( true, UserDataRequestFlags.BASIC_USER_DATA );
        });
      }
    });
  }

  openTrainingVideo1() {
    // training video 1 varies by volunteer type
    const video = this.userDataService.data.volunteerType === VolunteerType.TRUCK_STOP_VOLUNTEER ?
      TrainingVideoComponent.videos[VolunteerType.TRUCK_STOP_VOLUNTEER][0] :
      TrainingVideoComponent.videos[this.userDataService.data.volunteerType];
    this.modalService.open( TrainingVideoComponent, {
      video: video,
      onFinishedWatching: () => {
        // for truck stop volunteers, mark the first video as finished. otherwise, mark all videos as finished
        if ( this.userDataService.data.volunteerType === VolunteerType.TRUCK_STOP_VOLUNTEER ) {
          this.userDataService.data.hasWatchedTrainingVideo1 = true;
        } else {
          this.userDataService.data.hasWatchedTrainingVideos = true;
        }
        // save the state to the cache
        this.userDataService.updateCache();
      }
    });
  }

  openTrainingVideo2() {
    // training video 2 is always a truck stop volunteer video, because truck stop volunteers are the only
    // ones who watch two training videos
    this.modalService.open( TrainingVideoComponent, {
      video: TrainingVideoComponent.videos[VolunteerType.TRUCK_STOP_VOLUNTEER][1],
      onFinishedWatching: () => {
        this.userDataService.data.hasWatchedTrainingVideos = true;
        // save the state to the cache
        this.userDataService.updateCache();
      }
    });
  }

}
