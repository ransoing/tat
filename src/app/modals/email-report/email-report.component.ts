import { Component } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { Network } from '@ionic-native/network/ngx';
import { PlacesComponent } from '../places/places.component';
import { ModalService, MiscService } from '../../services';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss']
})
export class EmailReportComponent {

  public modal: HTMLIonModalElement;

  now = new Date();
  nowLocal = new Date( this.now.getTime() - this.now.getTimezoneOffset() * 60 * 1000 );
  form;

  constructor(
    private dialogs: Dialogs,
    private modalService: ModalService,
    private miscService: MiscService,
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
    let subject = 'Trafficking tip';
    let body = '';

    if ( this.form.contactedVictim ) {
      let d = this.form.victimDetails;
        body += `I've come into contact with a victim.
Victim's gender: ${d.gender}
Victim's appearance: ${d.appearance}
The victim:
`;
        if ( d.hasRestrictedCommunication ) body += "* has restricted or controlled communication.\n";
        if ( d.isDisheveled ) body += "* has a disheveled or unkempt appearance, is alone, scared, or crying\n";
        if ( d.isMinor ) body += "* is a minor traveling without adult supervision\n";
        if ( d.offersSex ) body += "* offered to exchange sex for a ride, meal, etc.\n";
        if ( d.doesNotKnow ) body += "* does not know the person who is picking him/her up\n";
        if ( d.hasPimp ) body += "* shows acknowledgement that she/he has a pimp and is making a quota\n";
        if ( d.hasBranding ) body += "* has signs of branding or tattooing of the trafficker's name\n";
        if ( d.hasLackOfKnowledge ) body += "* has a lack of knowledge of the community or his/her whereabouts\n";
        if ( d.hasNoId ) body += "* is not in control of his/her own identification documents\n";
        if ( d.other.trim().length > 0 ) body += "Other notes:\n" + d.other + "\n";
    }

    if ( this.form.people ) {
        body += `
There were people (other than victims) involved.
${this.form.peopleDetails}
`;
    }

    if ( this.form.cars ) {
        body += `
Vehicles were involved.
${this.form.carsDetails}
`;
    }

    if ( this.form.additional ) {
        body += `
Additional information:
${this.form.additional}
`;
    }

    if ( this.form.phone ) {
      body += `
My phone number:
${this.form.phone}
`;
    }

    // the date pickers return date/time as the selected value, but in the UTC time zone. Correct this
    let offset = new Date().getTimezoneOffset() * 60 * 1000;
    let outputDate = new Date( new Date(this.form.date).getTime() + offset ).toLocaleDateString();
    let outputTime = new Date( new Date(this.form.time).getTime() + offset ).toLocaleTimeString();

    body += `
The suspicious activity happened on ${outputDate}, ${outputTime}, at ${this.form.location}`;

    this.miscService.openExternalLink(
        'mailto:help@humantraffickinghotline.org?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body)
    );
  }

}
