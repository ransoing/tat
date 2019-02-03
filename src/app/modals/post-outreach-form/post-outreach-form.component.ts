import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TrxService, MiscService, UserDataService, UserDataRequestFlags, GetFeedbackService, IUnfinishedOutreachTarget } from '../../services';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './post-outreach-form.component.html'
})
export class PostOutreachFormComponent implements OnInit, OnDestroy {

  @Input() outreachTarget: IUnfinishedOutreachTarget;

  public modal: HTMLIonModalElement;
  public gfSurveyUrl;
  private gfSubscription: Subscription;
  
  constructor(
    public miscService: MiscService,
    public userDataService: UserDataService,
    public getFeedbackService: GetFeedbackService,
    public trx: TrxService
  ) {}

  ngOnInit() {
    // inputs don't get passed until ngInit
    this.gfSurveyUrl = this.getFeedbackService.getPostOutreachSurveyUrl( this.outreachTarget );
    
    // wait for the survey to be submitted
    this.gfSubscription = this.getFeedbackService.getFeedbackSubmitted.subscribe( async message => {
      // close the modal and show a success message
      this.modal.dismiss();
      this.miscService.showSimpleAlert( await this.trx.t( 'misc.success' ), await this.trx.t( 'volunteer.forms.postOutreach.submitSuccess' ) )
      .then( () => { return this.getFeedbackService.waitForSalesforceUpdate() } )
      .then( () => {
        // update the hours logs in the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS );
      });
    });
  }

  ngOnDestroy() {
    this.gfSubscription.unsubscribe();
  }

}
