import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import {
  PostOutreachSelectionComponent, 
  VolunteerResourcesComponent, VolunteerSettingsComponent, TrainingVideoComponent,
  SurveyComponent
} from '../../modals-volunteer';
import { ModalService, UserDataService, MiscService, SurveyService, TrxService } from '../../services';
import { UserDataRequestFlags, VolunteerType } from '../../models/user-data';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProxyAPIService } from '../../services/proxy-api.service';

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.page.html',
  styleUrls: ['./volunteer.page.scss'],
})
export class VolunteerPage {

  public VolunteerResourcesComponent = VolunteerResourcesComponent;
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
    private surveys: SurveyService,
    private trx: TrxService,
    private proxyAPI: ProxyAPIService
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

  async showPreOutreachForm() {
    // before opening the form, ask how many locations the user is going to visit.
    const alert = await this.alertCtrl.create({
      message: await this.trx.t( 'volunteer.forms.preOutreach.labels.howMany' ),
      inputs: [{
        name: 'numLocations',
        type: 'number',
        min: 1,
        max: 50,
        value: '1'
      }],
      buttons: [{
        text: await this.trx.t( 'misc.buttons.cancel'),
        role: 'cancel'
      }, {
        text: await this.trx.t( 'misc.buttons.ok'),
        handler: async ( inputs ) => {
          const numLocations = parseInt( inputs.numLocations );
          if ( isNaN(numLocations) ) {
            return;
          }
          
          try {
            let survey = await this.surveys.preOutreachSurvey( numLocations );
            this.modalService.open( SurveyComponent, {
              titleTranslationKey: 'volunteer.forms.preOutreach.title',
              successTranslationKey: 'volunteer.forms.preOutreach.submitSuccess',
              survey: survey,
              onSuccess: () => {
                // update just the unfinished activities in the user data
                this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
              }
            });
          } catch ( e ) {
            this.miscService.showErrorPopup( e );
          }

        }
      }]
    });

    alert.present();
  }

  showPreEventForm() {
    // @@TODO
    // @@Also create and import PostEventSelectionComponent or make the other SelectionComponent able to handle both events and outreach targets
  }


  openTrainingVideo() {
    // training video varies by volunteer type
    const videoKeys = {
      [ VolunteerType.VOLUNTEER_DISTRIBUTOR ]: 'volunteer-distributor',
      [ VolunteerType.AMBASSADOR_VOLUNTEER ]: 'tat-ambassador'
    };
    const videoUrlKey = videoKeys[this.userDataService.data.volunteerType];
    this.modalService.open( TrainingVideoComponent, {
      videoUrlKey: videoUrlKey,
      onFinishedWatching: () => {
        // in the background, send a message to the proxy to mark this the video as watched in salesforce
        // ...only if the user has just now watched it for the first time
        if ( !this.userDataService.data.hasWatchedTrainingVideo ) {
          this.userDataService.firebaseUser.getIdToken().then( token => {
            const payload = {
              firebaseIdToken: token,
              hasWatchedTrainingVideo: true
            };
            this.proxyAPI.post( 'updateUser', payload );
          });
        }

        this.userDataService.data.hasWatchedTrainingVideo = true;
        // save the state to the cache
        this.userDataService.updateCache();
      }
    });
  }

}
