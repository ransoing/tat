import { Component, AfterViewInit } from '@angular/core';
import { UserDataService, IIncompletePostReport } from '../../services';
import { NavController } from '@ionic/angular';

@Component({
  templateUrl: './post-outreach-selection.component.html',
  styleUrls: ['./post-outreach-selection.component.scss']
})
export class PostOutreachSelectionComponent implements AfterViewInit {

  public modal: HTMLIonModalElement;
  
  constructor(
    public userDataService: UserDataService,
    public navCtrl: NavController
  ) {}

  onReportClick( report: IIncompletePostReport ) {
    // @@ pass some kind of data to the report form about which report this is
    this.modal.dismiss();
    this.navCtrl.navigateRoot( '/por-1' );
  }

  ngAfterViewInit() {
    this.userDataService.fetchUserData();
  }

}
