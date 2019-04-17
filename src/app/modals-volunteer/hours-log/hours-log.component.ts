import { Component, AfterViewInit } from '@angular/core';
import { MiscService, ModalService, UserDataService, ScriptService } from '../../services';
import { SurveyService } from '../../services/surveys.service';
import { SurveyComponent } from '../survey/survey.component';
import { UserDataRequestFlags } from '../../models/user-data';
import { ProxyAPIService } from '../../services/proxy-api.service';

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
    private scripts: ScriptService,
    private proxyAPI: ProxyAPIService
  ) {}

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

  async openHoursLogForm() {
    // load the survey data from external URL
    // @@ define rough limited interfaces for these three services, for good code hinting
    // @@ create a surveyService (or repuprose the existing embedded one) to load the external
    //    script and pass it the required services, so I don't have to do that every time I want to
    //    generate a survey
    await this.scripts.loadScript( 'surveys' );
    let surveys = new window['SurveyService']( this.userDataService, this.proxyAPI, this.miscService );

    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.hoursLog.title',
      successTranslationKey: 'volunteer.forms.hoursLog.submitSuccess',
      survey: surveys.hoursLogSurvey(),
      onSuccess: () => {
        // update the hours logs part of the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.HOURS_LOGS );
      }
    });
  }

}
