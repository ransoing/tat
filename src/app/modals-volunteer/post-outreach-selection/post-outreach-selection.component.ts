import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, ModalService, SurveyService, MiscService, TrxService } from '../../services';
import { SurveyComponent } from '../survey/survey.component';
import { IOutreachLocation, UserDataRequestFlags } from '../../models/user-data';
import { AlertController } from '@ionic/angular';
import { ProxyAPIService } from '../../services/proxy-api.service';

@Component({
  templateUrl: './post-outreach-selection.component.html',
  styleUrls: ['./post-outreach-selection.component.scss']
})
export class PostOutreachSelectionComponent implements AfterViewInit {

  /** required for analytics to log a view to this modal */
  static screenName = 'Volunteer / Post-outreach Selection';

  public modal: HTMLIonModalElement;
  
  constructor(
    public userDataService: UserDataService,
    public modalService: ModalService,
    private surveys: SurveyService,
    private miscService: MiscService,
    private alertController: AlertController,
    private trx: TrxService,
    private proxyAPI: ProxyAPIService
  ) {}

  async openPostOutreachReport( outreachTarget: IOutreachLocation ) {
    // open the post outreach survey, passing in data from the selected target
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.postOutreach.title',
      successTranslationKey: 'volunteer.forms.postOutreach.submitSuccess',
      survey: await this.surveys.postOutreachSurvey( outreachTarget ),
      onSuccess: async () => {
        // update just the outreach locations in the user data
        await this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
        // close the modal if there are no more outreach locations
        if ( this.userDataService.data.outreachLocations.length === 0 ) {
          this.modal.dismiss();
        }

        // prompt the user to fill out the testimonial/feedback survey
        const alert = await this.alertController.create({
          message: await this.trx.t( 'volunteer.feedbackPrompt' ),
          buttons: [
            {
              text: await this.trx.t( 'misc.buttons.close' ),
              role: 'cancel'
            }, {
              text: await this.trx.t( 'misc.buttons.ok' ),
              handler: async () => {
                this.modalService.open( SurveyComponent, {
                  titleTranslationKey: 'volunteer.forms.feedback.title',
                  successTranslationKey: 'volunteer.forms.feedback.submitSuccess',
                  survey: await this.surveys.testimonialFeedbackSurvey( outreachTarget.campaignId ),
                  onSuccess: () => {}
                });
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

  getMapsLink( target: IOutreachLocation ): string {
    return 'http://maps.google.com?q=' + encodeURIComponent( `${target.street}, ${target.city}, ${target.state} ${target.zip}` );
  }

  async deleteTarget( target: IOutreachLocation ) {
    // show a confirmation prompt
    const alert = await this.alertController.create({
      message: await this.trx.t( 'misc.messages.deleteConfirm' ),
      buttons: [{
        text: await this.trx.t( 'misc.buttons.cancel'),
        role: 'cancel'
      }, {
        text: await this.trx.t( 'misc.buttons.delete'),
        cssClass: 'warning',
        handler: async () => {
          let payload = {
            firebaseIdToken: await this.userDataService.firebaseUser.getIdToken(),
            outreachLocationId: target.id
          };
          // send a request to the proxy to delete this
          try {
            await this.proxyAPI.post( 'deleteOutreachLocation', payload );
          } catch ( e ) {
            this.miscService.showErrorPopup( e.status === 0 ? 'misc.messages.requestErrorNetwork' : 'misc.messages.requestErrorUnknown' );
          }
          // reload the outreach locations
          await this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
          // close the modal if there are no more left
          if ( this.userDataService.data.outreachLocations.length == 0 ) {
            this.modal.dismiss();
          }
        }
      }]
    });
    alert.present();
  }

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
