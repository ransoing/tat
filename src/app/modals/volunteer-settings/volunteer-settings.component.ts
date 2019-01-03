import { Component } from '@angular/core';
import { MiscService, SettingsService } from '../../services';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: './volunteer-settings.component.html'
})
export class VolunteerSettingsComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    public miscService: MiscService,
    public settings: SettingsService,
    public navCtrl: NavController,
    private angularFireAuth: AngularFireAuth
  ) { }

  onLogout() {
    this.angularFireAuth.auth.signOut();
    // @@ should I continue to use miscService to determine login status?
    this.miscService.isLoggedIn = false;
    this.navCtrl.navigateRoot( '/tabs/(home:home)' );
    this.modal.dismiss();
  }

}
