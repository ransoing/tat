import { Component } from '@angular/core';
import { MiscService, SettingsService } from '../../services';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: './volunteer-settings.component.html'
})
export class VolunteerSettingsComponent {

  public modal: HTMLIonModalElement;
  
  constructor(
    private miscService: MiscService,
    private settings: SettingsService,
    private navCtrl: NavController
  ) { }

  onLogout() {
    this.miscService.isLoggedIn = false;
    this.navCtrl.navigateRoot( '/tabs/(home:home)' );
    this.modal.dismiss();
  }

}
