import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, IUnfinishedOutreachTarget, ModalService, GetFeedbackService, UserDataRequestFlags } from '../../services';
import { GetFeedbackSurveyComponent } from '../getfeedback-survey/getfeedback-survey.component';

@Component({
  templateUrl: './post-outreach-selection.component.html',
  styleUrls: ['./post-outreach-selection.component.scss']
})
export class PostOutreachSelectionComponent implements AfterViewInit {
  public modal: HTMLIonModalElement;
  
  constructor(
    public userDataService: UserDataService,
    public modalService: ModalService,
    private getFeedbackService: GetFeedbackService
  ) {}

  onTargetClick( outreachTarget: IUnfinishedOutreachTarget ) {
    // open the post outreach survey, passing in data from the selected target
    this.modalService.open( GetFeedbackSurveyComponent, {
      titleTranslationKey: 'volunteer.forms.postOutreach.title',
      successTranslationKey: 'volunteer.forms.postOutreach.submitSuccess',
      surveyUrl: this.getFeedbackService.getPostOutreachSurveyUrl( outreachTarget ),
      onSurveyFinished: () => {
        this.getFeedbackService.waitForSalesforceToUpdate()
        .then( () => {
          // update just the unfinished outreach targets in the user data
          this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS );
        });
      }
    });
  }

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
