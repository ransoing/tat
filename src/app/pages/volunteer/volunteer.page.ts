import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import {
  PostOutreachSelectionComponent, HoursLogComponent, 
  VolunteerResourcesComponent, VolunteerSettingsComponent, TrainingVideoComponent,
  SurveyComponent
} from '../../modals-volunteer';
import { ModalService, UserDataService, MiscService, SurveyService } from '../../services';
import { UserDataRequestFlags, VolunteerType } from '../../models/user-data';
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
    private surveys: SurveyService
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
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.feedback.title',
      successTranslationKey: 'volunteer.forms.feedback.submitSuccess',
      survey: this.surveys.testimonialFeedbackSurvey(),
      onSuccess: () => {}
    });
  }

  showPreOutreachForm() {
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.preOutreach.title',
      successTranslationKey: 'volunteer.forms.preOutreach.submitSuccess',
      survey: this.surveys.preOutreachSurvey(),
      onSuccess: () => {
        // update just the unfinished activities in the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
      }
    });
  }

  showPreEventForm() {
    // @@TODO
    // @@Also create and import PostEventSelectionComponent or make the other SelectionComponent able to handle both events and outreach targets
  }

  showTrainingVideoFeedbackForm() {
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.trainingFeedback.title',
      successTranslationKey: 'volunteer.forms.trainingFeedback.submitSuccess',
      survey: this.surveys.trainingVideoFeedbackSurvey(),
      onSuccess: () => {
        // update just the basic user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.BASIC_USER_DATA );
      }
    });
  }

  openTrainingVideo1() {
    // training video 1 varies by volunteer type
    const videoKeys = {
      [ VolunteerType.TRUCK_STOP_VOLUNTEER ]: 'truck-stop-volunteer-1',
      [ VolunteerType.AMBASSADOR_VOLUNTEER ]: 'tat-ambassador',
      [ VolunteerType.EVENT_VOLUNTEER ]: 'freedom-drivers'
    };
    const videoUrlKey = videoKeys[this.userDataService.data.volunteerType];
    this.modalService.open( TrainingVideoComponent, {
      videoUrlKey: videoUrlKey,
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
      videoUrlKey: 'truck-stop-volunteer-2',
      onFinishedWatching: () => {
        this.userDataService.data.hasWatchedTrainingVideos = true;
        // save the state to the cache
        this.userDataService.updateCache();
      }
    });
  }

}
