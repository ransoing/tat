import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, ModalService, SurveyService } from '../../services';
import { SurveyComponent } from '../survey/survey.component';
import { IUnfinishedOutreachTarget, UserDataRequestFlags } from '../../models/user-data';

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
  ) {}

  onTargetClick( outreachTarget: IUnfinishedOutreachTarget ) {
    // open the post outreach survey, passing in data from the selected target
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.postOutreach.title',
      successTranslationKey: 'volunteer.forms.postOutreach.submitSuccess',
      surveyUrl: this.surveys.postOutreachSurvey( outreachTarget ),
      onSuccess: () => {
        // update just the unfinished outreach targets in the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS );
      }
    });
  }

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
