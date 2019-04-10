import { Component } from '@angular/core';
import { SettingsService, UserDataService, ModalService, UserDataRequestFlags, GetFeedbackService, VolunteerType } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';
import { SurveyComponent } from '../survey/survey.component';
import { SurveyService } from '../../services/surveys.service';

@Component({
  templateUrl: './volunteer-settings.component.html'
})
export class VolunteerSettingsComponent {

  public modal: HTMLIonModalElement;
  public VolunteerType = VolunteerType;
  
  constructor(
    public settings: SettingsService,
    public userDataService: UserDataService,
    private angularFireAuth: AngularFireAuth,
    private modalService: ModalService,
    private surveys: SurveyService
  ) { }

  onLogout() {
    // redirection and modal-closing are handled in the auth subscriber in `app.component.ts`
    this.angularFireAuth.auth.signOut();
  }

  showEditAccountForm() {
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.editAccount.title',
      successTranslationKey: 'volunteer.forms.editAccount.submitSuccess',
      survey: this.surveys.editAccountSurvey(),
      onSuccess: () => {
        // update just the unfinished outreach targets in the user data
        this.userDataService.fetchUserData( true, UserDataRequestFlags.BASIC_USER_DATA );
      }
    });
  }
}
