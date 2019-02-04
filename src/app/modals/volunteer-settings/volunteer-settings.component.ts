import { Component } from '@angular/core';
import { SettingsService, UserDataService } from '../../services';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: './volunteer-settings.component.html'
})
export class VolunteerSettingsComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    public settings: SettingsService,
    public userDataService: UserDataService,
    private angularFireAuth: AngularFireAuth
  ) { }

  onLogout() {
    // redirection and modal-closing are handled in the auth subscriber in `app.component.ts`
    this.angularFireAuth.auth.signOut();
  }

}
