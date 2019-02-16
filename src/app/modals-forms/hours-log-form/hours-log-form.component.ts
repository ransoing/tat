import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrxService, MiscService, UserDataService, UserDataRequestFlags, GetFeedbackService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './hours-log-form.component.html'
})
export class HoursLogFormComponent implements OnInit, OnDestroy {

  public modal: HTMLIonModalElement;
  public gfSurveyUrl;
  private gfSubscription: Subscription;
  
  constructor(
    public miscService: MiscService,
    public userDataService: UserDataService,
    public getFeedbackService: GetFeedbackService,
    public trx: TrxService
  ) {
    this.gfSurveyUrl = this.getFeedbackService.getHoursLogSurveyUrl();
  }

  ngOnInit() {
    // wait for the survey to be submitted
    this.gfSubscription = this.getFeedbackService.getFeedbackSubmitted.subscribe( async message => {
      // close the modal and show a success message
      this.modal.dismiss();
      this.miscService.showSimpleAlert( await this.trx.t( 'misc.success' ), await this.trx.t( 'volunteer.forms.hoursLog.submitSuccess' ) )
      .then( () => { return this.getFeedbackService.waitForSalesforceUpdate() } )
      .then( () => {
        // update the hours logs in the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.HOURS_LOGS );
      });
    });
  }

  ngOnDestroy() {
    this.gfSubscription.unsubscribe();
  }

}
