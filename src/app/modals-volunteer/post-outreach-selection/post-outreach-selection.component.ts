import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, ModalService, SurveyService, MiscService, TrxService } from '../../services';
import { SurveyComponent } from '../survey/survey.component';
import { IUnfinishedActivity, UserDataRequestFlags } from '../../models/user-data';
import { AlertController } from '@ionic/angular';
import { ProxyAPIService } from '../../services/proxy-api.service';

@Component({
  templateUrl: './post-outreach-selection.component.html',
  styleUrls: ['./post-outreach-selection.component.scss']
})
export class PostOutreachSelectionComponent implements AfterViewInit {
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

  openPostOutreachReport( outreachTarget: IUnfinishedActivity ) {
    // open the post outreach survey, passing in data from the selected target
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.postOutreach.title',
      successTranslationKey: 'volunteer.forms.postOutreach.submitSuccess',
      survey: this.surveys.postOutreachSurvey( outreachTarget ),
      onSuccess: async () => {
        // update just the unfinished activities in the user data
        await this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_ACTIVITIES );
        // check if there is a scheduled notification for this unfinished activity, and cancel it
        this.miscService.cancelNotificationIf( notification => notification.data.salesforceId === outreachTarget.id );
      }
    });
  }

  getMapsLink( target: IUnfinishedActivity ): string {
    return 'http://maps.google.com?q=' + encodeURIComponent( `${target.address}, ${target.city}, ${target.state} ${target.zip}` );
  }

  async deleteTarget( target: IUnfinishedActivity ) {
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
            activityId: target.id
          };
          // send a request to the proxy to delete this
          this.proxyAPI.post( 'deleteVolunteerActivity', payload )
          // reload the unfinished activities
          .then( () => this.userDataService.fetchUserData(true, UserDataRequestFlags.UNFINISHED_ACTIVITIES) )
          .catch( () => this.miscService.showErrorPopup() );
        }
      }]
    });
    alert.present();
  }

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
