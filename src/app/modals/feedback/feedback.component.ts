import { Component } from '@angular/core';
import { TrxService, MiscService, GetFeedbackService, UserDataService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent {

  public modal: HTMLIonModalElement;
  public gfSurveyUrl;
  private gfSubscription: Subscription;
  
  constructor(
    public miscService: MiscService,
    public userDataService: UserDataService,
    public getFeedbackService: GetFeedbackService,
    public trx: TrxService
  ) {
    this.gfSurveyUrl = this.getFeedbackService.getFeedbackSurveyUrl();
  }

  ngOnInit() {
    // wait for the survey to be submitted
    this.gfSubscription = this.getFeedbackService.getFeedbackSubmitted.subscribe( async message => {
      // close the modal and show a success message
      this.modal.dismiss();
      this.miscService.showSimpleAlert( await this.trx.t( 'misc.success' ), await this.trx.t( 'volunteer.forms.feedback.submitSuccess' ) );
    });
  }

  ngOnDestroy() {
    this.gfSubscription.unsubscribe();
  }

}
