import { Component, Input } from '@angular/core';
import { TrxService, GetFeedbackService, UserDataService, ModalService } from '../../services';
import { GetFeedbackSurveyComponent } from '../getfeedback-survey/getfeedback-survey.component';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {

  /**
   * This component opens forms to gather needed info from a new user.
   */

  public modal: HTMLIonModalElement;

  public fields = {
    regCode: '',
    email: '',
    phone: ''
  };
  public activePart = 1;
  
  constructor(
    public trx: TrxService,
    public userDataService: UserDataService,
    public getFeedbackService: GetFeedbackService,
    public modalService: ModalService,
    public navCtrl: NavController
  ) {}

  nextIsDisabled() {
    if ( this.activePart === 1 ) {
      return !this.fields.regCode;
    } else {
      return !this.fields.email || !this.fields.phone;
    }
  }

  async advance() {
    if ( this.activePart === 1 ) {
      // check if the registration code is valid. If so, proceed to part 2. If not, let the user know.
      let codeIsValid = await this.userDataService.checkRegistrationCode( this.fields.regCode );
      if ( codeIsValid ) {
        this.activePart = 2;
      } // do nothing if code is invalid, because an error message is shown in the userDataService

    } else {
      // search for whether an existing entry in salesforce matches the submitted email and phone
      let salesforceId = await this.userDataService.searchForExistingContact( this.fields.email, this.fields.phone );
      if ( salesforceId === false ) {
        // do nothing. This is an error case. An error message is shown by userDataService code.
      } else {
        let surveyUrl = salesforceId === null ?
          this.getFeedbackService.getSignupSurveyUrlForNewContact( this.fields.email, this.fields.phone ): // New user has no entry in salesforce.
          this.getFeedbackService.getSignupSurveyUrlForExistingContact( salesforceId ); // New user already has an entry in salesforce.

        await this.modalService.open( GetFeedbackSurveyComponent, {
          titleTranslationKey: 'volunteer.forms.signup.title',
          successTranslationKey: 'volunteer.forms.signup.submitSuccess',
          surveyUrl: surveyUrl,
          onSurveyFinished: () => {
            // wait for the salesforce db to update, then fetch that data and go to the volunteer page
            this.getFeedbackService.waitForSalesforceToUpdate().then( () => {
              this.userDataService.fetchUserData( true );
              this.navCtrl.navigateRoot( '/tabs/(volunteer:volunteer)' );
            });
          }
        });

        this.modal.dismiss();
      }
    }
  }

}
