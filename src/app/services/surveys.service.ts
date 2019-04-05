import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TrxService } from './trx.service';
import { UserDataService, IUnfinishedOutreachTarget, OutreachLocationType, VolunteerType } from './user-data.service';
import { ISurvey, ISurveyFieldType } from '../modals-volunteer/survey/survey.component';

// contains objects defining all surveys.

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  constructor(
    private loadingController: LoadingController,
    private userDataService: UserDataService,
    private trx: TrxService
  ) {}

  private _yesNoOptions = [
    { value: 'yes', labelTranslationKey: 'misc.buttons.yes' },
    { value: 'no', labelTranslationKey: 'misc.buttons.no' }
  ];

  // @@ for all surveys, when submitting them, submit the user's firebase token as well.
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
          name: 'otherAccomplishments',
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
          name: 'otherAccomplishments',
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
          name: 'otherAccomplishments',
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
          // @@ merge `accomplishments` and `other accomplishments`
          alert('bam!');
          resolve();
        });
      }
    };
  }


  // getPreEventSurvey


  // getPostEventSurvey


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


  getSignupSurvey(): ISurvey {
    let salesforceId;
    let personExistsInSalesforce: boolean;

    return {
      pages: [{
        // page 1
        fields: [{
          type: ISurveyFieldType.TEXT,
          name: 'registrationCode',
          labelTranslationKey: 'volunteer.forms.signup.labels.registrationCode',
          isRequired: true,
        }],
        onContinue: vals => {
          return new Promise( async (resolve,reject) => {
            // check if the code is right. Loading message and error is handled in userDataService
            let codeIsValid = await this.userDataService.checkRegistrationCode( vals.registrationCode );
            if ( codeIsValid ) resolve();
            else reject();
          });
        }
      }, {
        // page 2
        topTextTranslationKey: 'volunteer.forms.signup.labels.intro',
        fields: [{
          type: ISurveyFieldType.EMAIL,
          name: 'email',
          labelTranslationKey: 'volunteer.forms.signup.labels.email',
          isRequired: true
        }, {
          type: ISurveyFieldType.TEL,
          name: 'phone',
          labelTranslationKey: 'volunteer.forms.signup.labels.phone',
          isRequired: true
        }],
        onContinue: vals => {
          return new Promise( async (resolve,reject) => {
            // search for whether an existing entry in salesforce matches the submitted email and phone
            salesforceId = await this.userDataService.searchForExistingContact( vals.email, vals.phone );
            if ( salesforceId === false ) {
              // This is an error case. An error message is shown by userDataService code.
              reject();
            } else {
              // if salesforceId === null, then the new user has no existing entry in salesforce.
              // otherwise, the new user already has an entry in salesforce, but it is not linked with a firebase uid.
              personExistsInSalesforce = salesforceId !== null;
              resolve();
            }
          });
        }
      }, {
        // page 3: details for a new salesforce entry
        isVisible: vals => !personExistsInSalesforce,
        fields: [{
          type: ISurveyFieldType.TEXT,
          name: 'firstName',
          labelTranslationKey: 'volunteer.forms.signup.labels.firstName',
          isRequired: true
        }, {
          type: ISurveyFieldType.TEXT,
          name: 'lastName',
          labelTranslationKey: 'volunteer.forms.signup.labels.lastName',
          isRequired: true
        }]
      }, {
        // page 4
        fields: [{
          type: ISurveyFieldType.SELECT,
          name: 'volunteerType',
          labelTranslationKey: 'volunteer.forms.signup.labels.volunteerType',
          isRequired: true,
          options: [
            { value: VolunteerType.TRUCK_STOP_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.truckStop' },
            { value: VolunteerType.EVENT_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.event' },
            { value: VolunteerType.AMBASSADOR_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.ambassador' }
          ]
        }]
      }, {
        // page 5
        topTextTranslationKey: 'volunteer.forms.signup.labels.whatAddress',
        fields: [{
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'mailingAddress'
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'mailingCity'
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'mailingState'
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'mailingZip'
        }]
      }, {
        // page 6
        topTextTranslationKey: 'volunteer.forms.signup.labels.partOfTeam',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'partOfTeam',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        // page 7
        isVisible: vals => vals.partOfTeam === 'yes',
        topTextTranslationKey: 'volunteer.forms.signup.labels.isCoordinator',
        fields: [{
          type: ISurveyFieldType.CHOICE,
          name: 'isCoordinator',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        isVisible: vals => vals.partOfTeam === 'yes' && vals.isCoordinator === 'no',
        topTextTranslationKey: 'volunteer.forms.signup.labels.whatName',
        fields: [{
          type: ISurveyFieldType.TEXT,
          name: 'coordinatorName',
          labelTranslationKey: 'volunteer.forms.signup.labels.coordinatorName',
          isRequired: true
        }]
      }],
      onComplete: ( vals ) => {
        return new Promise( (resolve,reject) => {
          // @@ the registration code is sent near the beginning.
          // @@ also send it when completing the form, so that new users are only made if the code is correct.
          // @@ i.e. the reg code is required to make a new user, and an existing user is required to do all other tasks.
          // @@ also send firebase uid, to be added to salesforce
          alert('bam!');
          resolve();
        });
      }
    };
  }


  // a survey to edit volunteer type and default mailing address
  getEditAccountSurvey() {
    let udata = this.userDataService.data;
    return {
      pages: [{
        // page 1
        fields: [{
          type: ISurveyFieldType.SELECT,
          name: 'volunteerType',
          labelTranslationKey: 'volunteer.forms.signup.labels.volunteerType',
          isRequired: true,
          defaultValue: udata.volunteerType,
          options: [
            { value: VolunteerType.TRUCK_STOP_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.truckStop' },
            { value: VolunteerType.EVENT_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.event' },
            { value: VolunteerType.AMBASSADOR_VOLUNTEER, labelTranslationKey: 'volunteer.forms.signup.labels.volunteerTypes.ambassador' }
          ]
        }]
      }, {
        // page 2
        topTextTranslationKey: 'volunteer.forms.signup.labels.whatAddress',
        fields: [{
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'mailingAddress',
          defaultValue: udata.address
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'mailingCity',
          defaultValue: udata.city
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'mailingState',
          defaultValue: udata.state
        }, {
          type: ISurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'mailingZip',
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

}