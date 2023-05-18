import { Component, OnInit } from '@angular/core';
import { Sim } from '@ionic-native/sim/ngx';
import { WhatToReportComponent } from '../../modals';
import { GeocoderService, ModalService, MiscService } from '../../services';
import { SurveyComponent } from '../../modals-volunteer';
import { ISurvey, SurveyFieldType } from '../../models/survey';
import { AppMode } from '../../models/app-mode';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from '../../services/analytics.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  WhatToReportComponent = WhatToReportComponent;
  hasSim = false;

  country: string = null; // 'USA', 'CAN', 'MEX', null, or possibly others
  countryFetched = false;
  pageUrl: string;

  textNumberTrxOptions = { phoneNumber: '233733' };

  country$ = new BehaviorSubject<string>( null );
  countrySubscription: Subscription;

  constructor(
    public modalService: ModalService,
    public miscService: MiscService,
    private alertController: AlertController,
    private sim: Sim,
    private geocoder: GeocoderService,
    private analyticsService: AnalyticsService
  ) {
    // in ELD mode, act like there's no SIM, because even if there is, we don't want to use it.
    // so, only get SIM info for TAT app, not for ELD app.
    // If no SIM is detected, the phone numbers will appear on the 'call' buttons.
    if ( environment.app === AppMode.TAT ) {
      this.sim.getSimInfo()
      .then( simData => this.hasSim = simData != null && !!simData.carrierName )
      .catch( e => this.hasSim = false );
    }

    // get the user's current country
    this.getCountry();
  }

  ngOnInit(): void {
    this.analyticsService.logPageView( 'Report Activity' );
  }

  async getCountry() {
    this.countryFetched = false;

    const alert = await this.alertController.create({
      backdropDismiss: false,
      cssClass: 'loading-location-alert',
      message: '<ion-spinner class="sc-ion-loading-md md spinner-crescent hydrated" role="progressbar"></ion-spinner> Getting your location...<br><br>This helps us show you the correct hotline phone numbers.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // cancel the location fetch.
          this.countrySubscription.unsubscribe();
          this.countryFetched = true;
          alert.dismiss();
        }
      }]
    });

    // if the location has been fetched recently, it will take a very short time, resulting in the alert showing for a split second.
    // Avoid this by waiting to show the alert.
    setTimeout( () => {
      if ( !this.countryFetched ) {
        alert.present();
      }
    }, 250 );

    this.countrySubscription = this.country$.subscribe( countryCode => {
      this.country = countryCode;
    });

    this.geocoder.getCountryCode().then( countryCode => {
      if ( !this.countryFetched ) {
        this.country$.next( countryCode );
        this.countryFetched = true;
        alert.dismiss();
      }
    });
  }

  private _yesNoOptions = [
    { value: 'yes', labelTranslationKey: 'misc.buttons.yes' },
    { value: 'no', labelTranslationKey: 'misc.buttons.no' }
  ];

  openEmailReportSurvey() {
    let survey: ISurvey = {
      pages: [
        () => { return {
        // page 1: intro
        topTextTranslationKey: 'emailReport.intro'
      }}, () => { return {
        // page 2: have you seen a victim?
        topTextTranslationKey: 'emailReport.checkboxes.seenVictim',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'hasSeenVictim',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }}, () => { return {
        // page 3: victim details
        isVisible: vals => vals.hasSeenVictim === 'yes',
        fields: [{
          type: SurveyFieldType.SELECT,
          labelTranslationKey: 'emailReport.victim.gender.label',
          name: 'victimGender',
          isRequired: true,
          options: [
            { value: 'Unknown', labelTranslationKey: 'emailReport.victim.gender.unknown' },
            { value: 'Female',  labelTranslationKey: 'emailReport.victim.gender.female' },
            { value: 'Male',    labelTranslationKey: 'emailReport.victim.gender.male' },
            { value: 'Other',   labelTranslationKey: 'emailReport.victim.gender.other' }
          ]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'victimAppearance',
          labelTranslationKey: 'emailReport.victim.appearance.label',
          helperTranslationKey: 'emailReport.victim.appearance.placeholder',
          isRequired: true
        }]
      }}, () => { return {
        // page 4: victim details, cont'd
        isVisible: vals => vals.hasSeenVictim === 'yes',
        topTextTranslationKey: 'emailReport.victim.flags.label',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'victimFlags',
          multi: true,
          options: [
            { value: 'The victim has restricted or controlled communication — not allowed to speak for self', labelTranslationKey: 'emailReport.victim.flags.hasRestrictedCommunication' },
            { value: 'The victim has a disheveled or unkempt appearance, is alone, scared, or crying', labelTranslationKey: 'emailReport.victim.flags.isDisheveled' },
            { value: 'The victim is a minor traveling without adult supervision', labelTranslationKey: 'emailReport.victim.flags.isMinor' },
            { value: 'The victim offers to exchange sex for a ride, meal, etc.', labelTranslationKey: 'emailReport.victim.flags.offersSex' },
            { value: 'The victim does not know the person who is picking him/her up', labelTranslationKey: 'emailReport.victim.flags.doesNotKnow' },
            { value: 'The victim shows any acknowledgement that she/he has a pimp and is making a quota', labelTranslationKey: 'emailReport.victim.flags.hasPimp' },
            { value: 'The victim has signs of branding or tattooing of the trafficker\'s name', labelTranslationKey: 'emailReport.victim.flags.hasBranding' },
            { value: 'The victim has a lack of knowledge of the community or his/her whereabouts', labelTranslationKey: 'emailReport.victim.flags.hasLackOfKnowledge' },
            { value: 'The victim is not in control of his/her own identification documents', labelTranslationKey: 'emailReport.victim.flags.hasNoId' }
          ]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'victimFlagsOther',
          labelTranslationKey: 'emailReport.victim.otherNotes.label'
        }]
      }}, () => { return {
        // page 5: Do you see other people?
        topTextTranslationKey: 'emailReport.checkboxes.otherPeople',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'hasSeenOtherPeople',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }}, () => { return {
        // page 6: Other people details
        isVisible: vals => vals.hasSeenOtherPeople === 'yes',
        topTextTranslationKey: 'emailReport.otherPeople.placeholder',
        fields: [{
          type: SurveyFieldType.TEXTAREA,
          name: 'otherPeopleDetails',
          labelTranslationKey: 'emailReport.otherPeople.label'
        }]
      }}, () => { return {
        // page 7: Are there vehicles?
        topTextTranslationKey: 'emailReport.checkboxes.cars',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'thereAreCars',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }}, () => { return {
        // page 8: cars details
        isVisible: vals => vals.thereAreCars === 'yes',
        topTextTranslationKey: 'emailReport.cars.placeholder',
        fields: [{
          type: SurveyFieldType.TEXTAREA,
          name: 'carDetails',
          labelTranslationKey: 'emailReport.otherPeople.label'
        }]
      }}, () => { return {
        // page 9: when
        topTextTranslationKey: 'emailReport.when.label',
        fields: [{
          type: SurveyFieldType.DATE,
          name: 'date',
          labelTranslationKey: 'misc.datetime.date',
          isRequired: true
        }, {
          type: SurveyFieldType.TIME,
          name: 'time',
          labelTranslationKey: 'misc.datetime.time',
          isRequired: true
        }]
      }}, () => { return {
        // page 10: where
        topTextTranslationKey: 'emailReport.where.label',
        fields: [{
          type: SurveyFieldType.TEXTAREA,
          name: 'location',
          isRequired: true
        }]
      }}, () => { return {
        // page 11: other
        topTextTranslationKey: 'emailReport.additional.label',
        fields: [{
          type: SurveyFieldType.TEXTAREA,
          name: 'additional'
        }]
      }}, () => { return {
        // page 12: phone
        topTextTranslationKey: 'emailReport.phone.label',
        fields: [{
          type: SurveyFieldType.TEL,
          name: 'phone',
          isRequired: true
        }]
      }}, () => { return {
        // page 13: end
        topTextTranslationKey: 'emailReport.notes'
      }}],
      submitButtonTranslationKey: 'emailReport.emailButton',
      onSubmit: vals => {
        const subject = 'Trafficking tip';
        let body = '';

        if ( vals.hasSeenVictim === 'yes' ) {
          body += `I've come into contact with a victim.\n`
            + `Victim's gender: ${vals.victimGender}\n`
            + `Victim's appearance: ${vals.victimAppearance}\n`
            + `${vals.victimFlags}; ${vals.victimFlagsOther}\n\n`;
        }
    
        if ( vals.hasSeenOtherPeople === 'yes' ) {
          body += `There were people other than victims involved.\n`
            + `${vals.otherPeopleDetails}\n\n`;
        }
    
        if ( vals.thereAreCars === 'yes' ) {
          body += `Vehicles were involved.\n`
            + `${vals.carDetails}\n\n`;
        }

        // parse date/time info
        let date = new Date( vals.date );
        let timeSplit = vals.time.split(':');
        date.setHours( parseInt(timeSplit[0]) );
        date.setMinutes( parseInt(timeSplit[1]) );
        const outputDate = date.toLocaleDateString();
        const outputTime = date.toLocaleTimeString();
        body += `The suspicious activity happened on ${outputDate}, ${outputTime}, at ${vals.location}.\n\n`;

        if ( vals.additional ) {
          body += `Additional information:\n`
            + `${vals.additional}\n\n`;
        }
    
        body += `My phone number: ${vals.phone}`;
    
        this.miscService.openExternalLink(
            'mailto:help@humantraffickinghotline.org?subject=' +
            encodeURIComponent(subject) +
            '&body=' +
            encodeURIComponent(body)
        );

        return new Promise( (resolve,reject) => resolve(null) );
      }
    };
    
    this.modalService.open( SurveyComponent, {
      titleTranslationKey: 'emailReport.title',
      successTranslationKey: '',
      survey: survey,
      onSuccess: () => {}
    });

  }
}
