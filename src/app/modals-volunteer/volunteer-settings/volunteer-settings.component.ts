import { Component } from '@angular/core';
import { SettingsService, UserDataService, ModalService, UserDataRequestFlags, GetFeedbackService } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';
import { GetFeedbackSurveyComponent } from '../getfeedback-survey/getfeedback-survey.component';

@Component({
  templateUrl: './volunteer-settings.component.html'
})
export class VolunteerSettingsComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    public settings: SettingsService,
    public userDataService: UserDataService,
    private angularFireAuth: AngularFireAuth,
    private modalService: ModalService,
    private getFeedbackService: GetFeedbackService
  ) { }

  onLogout() {
    // redirection and modal-closing are handled in the auth subscriber in `app.component.ts`
    this.angularFireAuth.auth.signOut();
  }

  showEditAccountForm() {
    this.modalService.open( GetFeedbackSurveyComponent, {
      titleTranslationKey: 'volunteer.forms.editAccount.title',
      successTranslationKey: 'volunteer.forms.editAccount.submitSuccess',
      surveyUrl: this.getFeedbackService.getEditAccountSurveyUrl(),
      onSurveyFinished: () => {
        this.getFeedbackService.waitForSalesforceToUpdate()
        .then( () => {
          // update just the unfinished outreach targets in the user data
          this.userDataService.fetchUserData( true, UserDataRequestFlags.BASIC_USER_DATA );
        });
      }
    });
  }
}
