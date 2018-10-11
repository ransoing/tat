import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-report',
  templateUrl: './email-report.component.html',
  styleUrls: ['./email-report.component.scss']
})
export class EmailReportComponent implements OnInit {

  public modal: HTMLIonModalElement;

  now = new Date();
  nowLocal = new Date( this.now.getTime() - this.now.getTimezoneOffset() * 60 * 1000 );

  form = {
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

  constructor( ) {}

  ngOnInit() {
  }

}
