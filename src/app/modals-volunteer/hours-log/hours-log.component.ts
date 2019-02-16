import { Component, AfterViewInit } from '@angular/core';
import { MiscService, ModalService, UserDataService, GetFeedbackService, UserDataRequestFlags } from '../../services';
import { GetFeedbackSurveyComponent } from '../getfeedback-survey/getfeedback-survey.component';

@Component({
  templateUrl: './hours-log.component.html',
  styleUrls: ['./hours-log.component.scss']
})
export class HoursLogComponent implements AfterViewInit {

  public modal: HTMLIonModalElement;
  
  constructor(
    public miscService: MiscService,
    public modalService: ModalService,
    public userDataService: UserDataService,
    private getFeedbackService: GetFeedbackService
  ) {}

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

  openHoursLogForm() {
    this.modalService.open( GetFeedbackSurveyComponent, {
      titleTranslationKey: 'volunteer.forms.hoursLog.title',
      successTranslationKey: 'volunteer.forms.hoursLog.submitSuccess',
      surveyUrl: this.getFeedbackService.getHoursLogSurveyUrl(),
      onSurveyFinished: () => {
        this.getFeedbackService.waitForSalesforceToUpdate()
        .then( () => {
          // update the hours logs in the user data
          this.userDataService.fetchUserData( true, UserDataRequestFlags.HOURS_LOGS );
        });
      }
    });
  }

}
