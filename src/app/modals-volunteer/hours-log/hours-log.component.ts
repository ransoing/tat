import { Component, AfterViewInit } from '@angular/core';
import { MiscService, ModalService, UserDataService } from '../../services';
import { SurveyService } from '../../services/surveys.service';
import { SurveyComponent } from '../survey/survey.component';
import { UserDataRequestFlags } from '../../models/user-data';

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
    private surveys: SurveyService
  ) {}

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

  async openHoursLogForm() {
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.hoursLog.title',
      successTranslationKey: 'volunteer.forms.hoursLog.submitSuccess',
      survey: this.surveys.hoursLogSurvey(),
      onSuccess: () => {
        // update the hours logs part of the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.HOURS_LOGS );
      }
    });
  }

}
