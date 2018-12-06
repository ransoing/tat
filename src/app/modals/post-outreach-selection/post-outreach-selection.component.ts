import { Component } from '@angular/core';
import { UserDataService, IIncompletePostReport } from '../../services';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: './post-outreach-selection.component.html',
  styleUrls: ['./post-outreach-selection.component.scss']
})
export class PostOutreachSelectionComponent {

  private modal: HTMLIonModalElement;
  
  constructor(
    private userDataService: UserDataService,
    private navCtrl: NavController
  ) {
    console.log( this.userDataService.data.incompletePostReports );
  }

  onReportClick( report: IIncompletePostReport ) {
    // @@ pass some kind of data to the report form about which report this is
    this.modal.dismiss();
    this.navCtrl.navigateRoot( '/por-1' );
  }

}
