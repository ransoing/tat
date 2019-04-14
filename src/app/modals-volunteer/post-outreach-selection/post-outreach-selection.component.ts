import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, ModalService, SurveyService, MiscService } from '../../services';
import { SurveyComponent } from '../survey/survey.component';
import { IUnfinishedActivity, UserDataRequestFlags } from '../../models/user-data';

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
    private miscService: MiscService
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

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
