import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { TrxService } from './trx.service';
import { UserDataService, IUnfinishedOutreachTarget, OutreachLocationType, VolunteerType } from './user-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ISurvey, ISurveyFieldType } from '../modals-volunteer/survey/survey.component';

// contains objects defining all surveys.

@Injectable({
  providedIn: 'root',
})
export class SurveyService {


  // The nice labels for the different outreach targets. This is required to pre-fill some getfeedback survey fields.
  // The values must exactly match those in the survey.
  private readonly outreachTargetBackwardsMapping = {
    [OutreachLocationType.CDL_SCHOOL]: 'CDL School',
    [OutreachLocationType.TRUCK_STOP]: 'Truck Stop',
    [OutreachLocationType.TRUCKING_COMPANY]: 'Trucking Company'
  };

  // The nice labels for volunteer types. This is required to pre-fill some fields.
  // The values must exactly match those in the survey.
  private readonly volunteerTypeBackwardsMapping = {
    [VolunteerType.TRUCK_STOP_VOLUNTEER]: 'Truck Stop Volunteer',
    [VolunteerType.EVENT_VOLUNTEER]: 'Freedom Drivers Volunteer',
    [VolunteerType.AMBASSADOR_VOLUNTEER]: 'TAT Ambassador'
  };


  constructor(
    private loadingController: LoadingController,
    private userDataService: UserDataService,
    private sanitizer: DomSanitizer,
    private trx: TrxService
  ) {}

  private _yesNoOptions = [
    { value: 'yes', labelTranslationKey: 'misc.buttons.yes' },
    { value: 'no', labelTranslationKey: 'misc.buttons.no' }
  ];

  // @@ for all surveys, when submitting them, submit my firebase token as well.
  // the proxy can glean the salesforceID from that.

  getHoursLogSurvey(): ISurvey {
    return {
      pages: [{
        // page 1
        topTextTranslationKey: 'volunteer.forms.hoursLog.labels.describe',
        fields: [{
          type: ISurveyFieldType.TEXTAREA,
          name: 'description',
          isRequired: true
        }]
      }, {
        // page 2
        fields: [{
          type: ISurveyFieldType.DATE,
          labelTranslationKey: 'volunteer.forms.hoursLog.labels.date',
          name: 'date',
          isRequired: true
        }, {
          type: ISurveyFieldType.NUMBER,
          labelTranslationKey: 'volunteer.forms.hoursLog.labels.numHours',
          name: 'numHours',
          isRequired: true
        }]
      }],

      onComplete: ( vals ) => {
        return new Promise( (resolve,reject) => {
          // @@
          alert('bam!');
          resolve();
        });
      }
    };
  }


  getPreOutreachSurvey(): ISurvey {
    let udata = this.userDataService.data;
    return {
      pages: [{
        // page 1
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatLocation',
        fields: [{
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationName',
          name: 'locationName',
          isRequired: true
        }, {
          type: ISurveyFieldType.SELECT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationType',
          name: 'locationType',
          options: [
            { value: OutreachLocationType.CDL_SCHOOL, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.cdlSchool' },
            { value: OutreachLocationType.TRUCK_STOP, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckStop' },
            { value: OutreachLocationType.TRUCKING_COMPANY, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckingCompany' }
          ],
          isRequired: true
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'locationAddress',
          isRequired: true
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'locationCity',
          isRequired: true
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'locationState',
          isRequired: true
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'locationZip',
          isRequired: true
        }]
      }, {
        // page 2
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.haveYouContacted',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'hasContactedManager',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }, {
        // page 3
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.areYouReady',
        isVisible: vals => vals.hasContactedManager == 'yes',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'isReadyToReceive',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }, {
        // page 4
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatAddress',
        isVisible: vals => vals.hasContactedManager == 'yes' && vals.isReadyToReceive == 'yes',
        fields: [{
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'mailingAddress',
          isRequired: true,
          defaultValue: udata.address
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'mailingCity',
          isRequired: true,
          defaultValue: udata.city
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'mailingState',
          isRequired: true,
          defaultValue: udata.state
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'mailingZip',
          isRequired: true,
          defaultValue: udata.zip
        }]
      }],

      onComplete: ( vals ) => {
        return new Promise( (resolve,reject) => {
          // @@
          alert('bam!');
          resolve();
        });
      }
    };
  }


  getPostOutreachSurvey( outreachTarget: IUnfinishedOutreachTarget ): ISurvey {
    return {
      pages: [{
        // page 1: truck stop
        isVisible: vals => outreachTarget.type === OutreachLocationType.TRUCK_STOP,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          // The form will submit the English versions of the text, but the user's language will be displayed
          options: [{
            value: 'Truck stop is now distributing TAT materials at their location',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.distributing'
          }, {
            value: 'Truck stop will now train employees with TAT materials',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.training'
          }, {
            value: 'Truck stop has asked for an in-person training for all employees',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.inPersonTraining'
          }, {
            value: 'Truck stop is open to having an outreach at their location to speak with drivers in an appropriate format',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.hostOutreach'
          }]
        }, {
          type: ISurveyFieldType.TEXTAREA,
          name: 'otherAcoomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }, {
        // page 2: CDL school
        isVisible: vals => outreachTarget.type === OutreachLocationType.CDL_SCHOOL,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          // The form will submit the English versions of the text, but the user's language will be displayed
          options: [{
            value: 'CDL instructor will begin using TAT training with students',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.cdlSchool.using'
          }, {
            value: 'CDL instructor plans to pass on TAT information to other faculty',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.cdlSchool.passInfo'
          }]
        }, {
          type: ISurveyFieldType.TEXTAREA,
          name: 'otherAcoomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }, {
        // page 3: trucking company
        isVisible: vals => outreachTarget.type === OutreachLocationType.TRUCKING_COMPANY,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          // The form will submit the English versions of the text, but the user's language will be displayed
          options: [{
            value: 'Trucking company plans to show their drivers the TAT training video and hand out wallet cards.',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckingCompany.showDrivers'
          }]
        }, {
          type: ISurveyFieldType.TEXTAREA,
          name: 'otherAcoomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }, {
        // page 4
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUp',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'willFollowUp',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        // page 5
        isVisible: vals => vals.willFollowUp === 'yes',
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUpWhen',
        fields: [{
          type: ISurveyFieldType.DATE,
          name: 'followUpDate',
          labelTranslationKey: 'volunteer.forms.postOutreach.labels.followUpDate',
          isRequired: true
        }]
      }],
      onComplete: ( vals ) => {
        return new Promise( (resolve,reject) => {
          // @@
          alert('bam!');
          resolve();
        });
      }
    };
  }


  getTestimonialFeedbackSurvey(): ISurvey {
    return {
      pages: [{
        topTextTranslationKey: 'volunteer.forms.feedback.labels.whatAdvice',
        fields: [{ type: ISurveyFieldType.TEXTAREA, name: 'advice' }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.bestPart',
        fields: [{ type: ISurveyFieldType.TEXTAREA, name: 'bestPart' }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.improvements',
        fields: [{ type: ISurveyFieldType.TEXTAREA, name: 'improvements' }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.giveAnonPermission',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'givesAnonPermission',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.giveNamePermission',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'givesNamePermission',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }],
      onComplete: ( vals ) => {
        return new Promise( (resolve,reject) => {
          // @@
          alert('bam!');
          resolve();
        });
      }
    };
  }


  getTrainingVideoFeedbackSurvey(): ISurvey {
    return {
      pages: [{
        // page 1
        topTextTranslationKey:
          this.userDataService.data.volunteerType === VolunteerType.TRUCK_STOP_VOLUNTEER ?
          'volunteer.forms.trainingFeedback.labels.equippedForOutreach' :
          'volunteer.forms.trainingFeedback.labels.confidentInPresenting',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'feelsPrepared',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }, {
        // page 2
        isVisible: vals => vals.feelsPrepared === 'no',
        topTextTranslationKey: 'volunteer.forms.trainingFeedback.labels.whatQuestions',
        fields: [{
          type: ISurveyFieldType.TEXTAREA,
          name: 'questions'
        }]
      }],
      onComplete: ( vals ) => {
        return new Promise( (resolve,reject) => {
          // @@
          alert('bam!');
          resolve();
        });
      }
    };
  }

  // /**
  //  * Use this method when a new user is signing up, and does not have a Contact entry in salesforce.
  //  */
  // getSignupSurveyUrlForNewContact( email: string, phone: string ) {
  //   return this.makeTrustedUrl( this.surveyUrlBases.signup, {
  //     'gf_q[7447327][15018741]': this.userDataService.firebaseUser.uid,
  //     'gf_q[7290681][14733013]': phone,
  //     'gf_q[7290681][14733014]': email,
  //     'gf_q[7447327][15019556]': 'true' // mark as new user
  //   });
  // }

  // /**
  //  * Use this method when a new user is signing up, and already has a Contact entry in salesforce.
  //  */
  // getSignupSurveyUrlForExistingContact( salesforceId: string ) {
  //   return this.makeTrustedUrl( this.surveyUrlBases.signup, {
  //     'ContactID': salesforceId,
  //     'gf_q[7447327][15018741]': this.userDataService.firebaseUser.uid,
  //     'gf_q[7447327][15019556]': 'true' // mark as new user
  //   });
  // }

  // getEditAccountSurveyUrl() {
  //   // uses the same survey as signup, but fills in a bunch of fields and provides a salesforce merge field.
  //   // The presence of the merge field causes GetFeedback to update a salesforce entry rather than make a new one.
  //   let udata = this.userDataService.data;
  //   return this.makeTrustedUrl( this.surveyUrlBases.signup, {
  //     'ContactID': udata.salesforceId,
  //     'gf_q[7447327][15018741]': this.userDataService.firebaseUser.uid,
  //     'gf_q[7447327][15018742]': this.volunteerTypeBackwardsMapping[udata.volunteerType],
  //     'gf_q[7290682][14733012]': udata.address,
  //     'gf_q[7290682][14733015]': udata.city,
  //     'gf_q[7290682][14733016]': udata.state,
  //     'gf_q[7290682][14733017]': udata.zip,
  //     'gf_q[7447327][15019556]': 'false' // mark as not new user
  //   });
  // }

  // /**
  //  * 
  //  * @param url 
  //  * @param queryParams Key-value pairs which get converted to a GET query string
  //  */
  // private makeTrustedUrl( url: string, queryParams: Object ) {
  //   // convert keys and values in the queryParams object to &[key]=[value] URL syntax
  //   let queryString = Object.keys( queryParams ).reduce( (query, key) => {
  //     // For values that are null or undefined, set them to a blank string, otherwise we'll end up
  //     // literally passing the string 'null' to the form
  //     let value = ( queryParams[key] === null || undefined ) ? '' : queryParams[key];
  //     return query + '&' + key + '=' + encodeURIComponent( value );
  //   }, '' );
  //   return this.sanitizer.bypassSecurityTrustResourceUrl( url + '?' + queryString + '&gf_footer_background_off' );
  // }

}