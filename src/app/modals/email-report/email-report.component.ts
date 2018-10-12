import { Component, OnInit } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Network } from '@ionic-native/network/ngx';
import { PlacesComponent } from '../places/places.component';
import { ModalService } from '../../services';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss']
})
export class EmailReportComponent implements OnInit {

  public modal: HTMLIonModalElement;

  now = new Date();
  nowLocal = new Date( this.now.getTime() - this.now.getTimezoneOffset() * 60 * 1000 );
  form;

  constructor(
    private dialogs: Dialogs,
    private modalService: ModalService,
    private network:Network
  ) {
    this.resetReportForm( false );
  }

  resetReportForm( requireConfirmation: boolean = true ) {
    if ( requireConfirmation ) {
      this.dialogs.confirm( 'Are you sure you want to reset the form?' )
      .then( () => this.doResetReportForm() )
      .catch( () => {} );
    } else {
      this.doResetReportForm();
    }
  }

  private doResetReportForm() {
    this.form = {
      contactedVictim: false,
      victimDetails: {
        gender: undefined,
        appearance: '',
        hasRestrictedCommunication: false,
        isDisheveled: false,
        isMinor: false,
        offersSex: false,
        doesNotKnow: false,
        hasPimp: false,
        hasBranding: false,
        hasLackOfKnowledge: false,
        hasNoId: false,
        other: ''
      },
  
      people: false,
      peopleDetails: '',
  
      cars: false,
      carsDetails: '',
  
      date: this.nowLocal.toISOString(),
      time: this.nowLocal.toISOString(),
  
      location: '',
      additional: '',
      phone: undefined
    };
  }

  async automaticallyGetLocation() {
    // check for an internet connection
    try {
      if ( this.network.type === 'none' ) {
        this.dialogs.alert( 'You must be connected to the internet to use this feature.' );
        return;
      }
    } catch (e) {
      this.dialogs.alert( 'Notice: You must be connected to the internet to use this feature.' );
      // continue anyway.
    }

    // open a modal which loads a list of nearby places
    let modal = await this.modalService.open( PlacesComponent );
    let returnedData = await modal.onDidDismiss();

    // @@ get the clicked-on nearby place and populate the 'location' field with it
    console.log( returnedData.data )
  }

  buildReportEmail() {
    
  }

  ngOnInit() {
  }

}
