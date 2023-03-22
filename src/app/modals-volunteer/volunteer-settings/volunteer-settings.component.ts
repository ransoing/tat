import { Component } from '@angular/core';
import { SettingsService, UserDataService, ModalService, SurveyService, ProxyAPIService, MiscService } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';
import { SurveyComponent } from '../survey/survey.component';
import { UserDataRequestFlags, VolunteerType, IUserData } from '../../models/user-data';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

@Component({
  templateUrl: './volunteer-settings.component.html',
  styleUrls: [ './volunteer-settings.component.scss' ]
})
export class VolunteerSettingsComponent {

  /** required for analytics to log a view to this modal */
  static screenName = 'Volunteer / Settings';

  public modal: HTMLIonModalElement;
  public VolunteerType = VolunteerType;
  // a mirror of the notification settings. This is needed because the setting
  // will revert itself if there's an HTTP error, and that reverting would otherwise trigger
  // a loop of unending requests to attempt to change the preference
  public notificationPrefs: IUserData['notificationPreferences'];

  constructor(
    public settings: SettingsService,
    public userDataService: UserDataService,
    private angularFireAuth: AngularFireAuth,
    private modalService: ModalService,
    private surveys: SurveyService,
    private proxyApiService: ProxyAPIService,
    private firebase: FirebaseX,
    private miscService: MiscService
  ) {
    this.notificationPrefs = Object.assign( {}, this.userDataService.data.notificationPreferences );
  }

  async onLogout() {
    // first, unregister this device's fcm token with both Firebase and the proxy
    this.proxyApiService.post(
      'unregisterFcmToken',
      {
        firebaseIdToken: await this.userDataService.firebaseUser.getIdToken(),
        fcmToken: await this.firebase.getToken()
      },
      false
    );
    this.firebase.unregister();

    // redirection and modal-closing are handled in the auth subscriber in `app.component.ts`
    await this.miscService.showLoadingPopup();
    this.miscService.goBackHome();
    await this.angularFireAuth.auth.signOut();
    await this.miscService.hideLoadingPopup();
  }

  updateNotificationPrefs( notificationPrefKey: string ) {
    // only proceed if the local representation of the preferences does not match the official one in userDataService
    if ( this.notificationPrefs[notificationPrefKey] === this.userDataService.data.notificationPreferences[notificationPrefKey] ) {
      return;
    }
    const newVal = this.notificationPrefs[notificationPrefKey];
    this.userDataService.updateNotificationPreferences( { [notificationPrefKey]: newVal }, true ).then( response => {
      if ( !(response && response.success) ) {
          throw '';
      }
      // change the official representation of the setting in userDataService
      this.userDataService.data.notificationPreferences[notificationPrefKey] = newVal;
    }).catch( e => {
      this.miscService.showErrorPopup( e.status === 0 ? 'misc.messages.requestErrorNetwork' : 'misc.messages.requestErrorUnknown' );
      // the setting failed to apply, so revert the toggle component
      this.notificationPrefs[notificationPrefKey] = !newVal;
    });
  }

  async showEditAccountForm() {
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'volunteer.forms.editAccount.title',
      successTranslationKey: 'volunteer.forms.editAccount.submitSuccess',
      survey: await this.surveys.editAccountSurvey(),
      onSuccess: () => {
        this.userDataService.fetchUserData( true, UserDataRequestFlags.ALL );
      }
    });
  }
}
