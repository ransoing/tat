import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';
import { ISurvey, SurveyFieldType } from '../models/survey';
import { ProxyAPIService } from './proxy-api.service';
import { MiscService } from './misc.service';
import { IUnfinishedActivity, OutreachLocationType, VolunteerType } from '../models/user-data';

// contains objects defining all surveys.

@Injectable({
  providedIn: 'root',
})
export class SurveyService {

  constructor(
    private userDataService: UserDataService,
    private proxyAPI: ProxyAPIService,
    private miscService: MiscService
  ) {}

  private _yesNoOptions = [
    { value: 'yes', labelTranslationKey: 'misc.buttons.yes' },
    { value: 'no', labelTranslationKey: 'misc.buttons.no' }
  ];


  hoursLogSurvey(): ISurvey {
    return {
      pages: [{
        // page 1
        topTextTranslationKey: 'volunteer.forms.hoursLog.labels.describe',
        fields: [{
          type: SurveyFieldType.TEXTAREA,
          name: 'description',
          isRequired: true
        }]
      }, {
        // page 2
        fields: [{
          type: SurveyFieldType.DATE,
          labelTranslationKey: 'volunteer.forms.hoursLog.labels.date',
          name: 'date',
          isRequired: true
        }, {
          type: SurveyFieldType.NUMBER,
          labelTranslationKey: 'volunteer.forms.hoursLog.labels.numHours',
          name: 'numHours',
          isRequired: true
        }]
      }],

      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.date = this.miscService.dateToLocalYYYYMMDD( vals.date );
        vals.numHours = parseFloat( vals.numHours );

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createHoursLogEntry', vals );
      }
    };
  }


  preOutreachSurvey(): ISurvey {
    let udata = this.userDataService.data;
    return {
      pages: [{
        // page 1
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatLocation',
        fields: [{
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationName',
          name: 'locationName',
          isRequired: true
        }, {
          type: SurveyFieldType.SELECT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationType',
          name: 'locationType',
          options: [
            { value: OutreachLocationType.CDL_SCHOOL, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.cdlSchool' },
            { value: OutreachLocationType.TRUCK_STOP, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckStop' },
            { value: OutreachLocationType.TRUCKING_COMPANY, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckingCompany' }
          ],
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'locationAddress',
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'locationCity',
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'locationState',
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'locationZip',
          isRequired: true
        }]
      }, {
        // page 2
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.haveYouContacted',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'hasContactedManager',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }, {
        // page 3
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.areYouReady',
        isVisible: vals => vals.hasContactedManager == 'yes',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'isReadyToReceive',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }, {
        // page 4
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatAddress',
        isVisible: vals => vals.hasContactedManager == 'yes' && vals.isReadyToReceive == 'yes',
        fields: [{
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'mailingAddress',
          isRequired: true,
          defaultValue: udata.address
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'mailingCity',
          isRequired: true,
          defaultValue: udata.city
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'mailingState',
          isRequired: true,
          defaultValue: udata.state
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'mailingZip',
          isRequired: true,
          defaultValue: udata.zip
        }]
      }],

      onSubmit: async vals => {
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        // convert some yes/no values to booleans
        vals.hasContactedManager = vals.hasContactedManager === 'yes';
        vals.isReadyToReceive = vals.isReadyToReceive === 'yes';

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createPreOutreachSurvey', vals );
      }
    };
  }


  postOutreachSurvey( outreachTarget: IUnfinishedActivity ): ISurvey {
    return {
      pages: [{
        // page 1: truck stop
        isVisible: vals => outreachTarget.type === OutreachLocationType.TRUCK_STOP,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
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
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }, {
        // page 2: CDL school
        isVisible: vals => outreachTarget.type === OutreachLocationType.CDL_SCHOOL,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
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
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }, {
        // page 3: trucking company
        isVisible: vals => outreachTarget.type === OutreachLocationType.TRUCKING_COMPANY,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          // The form will submit the English versions of the text, but the user's language will be displayed
          options: [{
            value: 'Trucking company plans to show their drivers the TAT training video and hand out wallet cards.',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckingCompany.showDrivers'
          }]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }, {
        // page 4
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUp',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'willFollowUp',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        // page 5
        isVisible: vals => vals.willFollowUp === 'yes',
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUpWhen',
        fields: [{
          type: SurveyFieldType.DATE,
          name: 'followUpDate',
          labelTranslationKey: 'volunteer.forms.postOutreach.labels.followUpDate',
          isRequired: true
        }]
      }],
      onSubmit: async vals => {
        // alter some values before sending to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.willFollowUp = vals.willFollowUp === 'yes';
        vals.followUpDate = this.miscService.dateToLocalYYYYMMDD( vals.followUpDate );
        // merge 'accomplishments' and 'other accomplishments'
        vals.accomplishments += ' ' + vals.otherAccomplishments;

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createPostOutreachReport', vals );
      }
    };
  }


  // preEventSurvey


  // postEventSurvey


  testimonialFeedbackSurvey(): ISurvey {
    return {
      pages: [{
        topTextTranslationKey: 'volunteer.forms.feedback.labels.whatAdvice',
        fields: [{ type: SurveyFieldType.TEXTAREA, name: 'advice' }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.bestPart',
        fields: [{ type: SurveyFieldType.TEXTAREA, name: 'bestPart' }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.improvements',
        fields: [{ type: SurveyFieldType.TEXTAREA, name: 'improvements' }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.giveAnonPermission',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'givesAnonPermission',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        topTextTranslationKey: 'volunteer.forms.feedback.labels.giveNamePermission',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'givesNamePermission',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }],
      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.givesAnonPermission = vals.givesAnonPermission === 'yes';
        vals.givesNamePermission = vals.givesNamePermission === 'yes';

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createTestimonial', vals );
      }
    };
  }


  trainingVideoFeedbackSurvey(): ISurvey {
    return {
      pages: [{
        // page 1
        topTextTranslationKey:
          this.userDataService.data.volunteerType === VolunteerType.TRUCK_STOP_VOLUNTEER ?
          'volunteer.forms.trainingFeedback.labels.equippedForOutreach' :
          'volunteer.forms.trainingFeedback.labels.confidentInPresenting',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'feelsPrepared',
          options: this._yesNoOptions,
          isRequired: true
        }]
      }, {
        // page 2
        isVisible: vals => vals.feelsPrepared === 'no',
        topTextTranslationKey: 'volunteer.forms.trainingFeedback.labels.whatQuestions',
        fields: [{
          type: SurveyFieldType.TEXTAREA,
          name: 'questions'
        }]
      }],
      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.feelsPrepared = vals.feelsPrepared === 'yes';

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createTrainingVideoFeedback', vals );
      }
    };
  }


  signupSurvey(): ISurvey {
    let salesforceId;

    return {
      pages: [{
        // page 1
        fields: [{
          type: SurveyFieldType.TEXT,
          name: 'registrationCode',
          labelTranslationKey: 'volunteer.forms.signup.labels.registrationCode',
          isRequired: true,
        }],
        onContinue: vals => {
          // check if the registration code is valid
          return this.proxyAPI.get( 'checkRegistrationCode?code=' + encodeURIComponent(vals.registrationCode) )
          .then( response => {
            if ( !response || !response.success ) throw '';
          }).catch( e => {
            // check the error code to show an appropriate message
            let errorKey = ( e.error && e.error.errorCode && e.error.errorCode === 'INCORRECT_REGISTRATION_CODE' ) ?
              'volunteer.forms.signup.invalidCode' :
              'misc.messages.requestError';
            // show an error message.
            throw this.miscService.showErrorPopup( errorKey );
          });
        }
      }, {
        // page 2
        topTextTranslationKey: 'volunteer.forms.signup.labels.intro',
        fields: [{
          type: SurveyFieldType.EMAIL,
          name: 'email',
          labelTranslationKey: 'volunteer.forms.signup.labels.email',
          isRequired: true
        }, {
          type: SurveyFieldType.TEL,
          name: 'phone',
          labelTranslationKey: 'volunteer.forms.signup.labels.phone',
          isRequired: true
        }],
        onContinue: vals => {
          salesforceId = undefined;
          // search for whether there is an existing salesforce Contact that matches the phone/email
          return this.proxyAPI.get( 'contactSearch?email=' + encodeURIComponent(vals.email) + '&phone=' + encodeURIComponent(vals.phone) )
          .then( response => {
            if ( response && response.salesforceId ) {
              salesforceId = response.salesforceId;
              return;
            } else throw '';
          }).catch( e => {
            // check error code and show an appropriate error message
            let errorKey = 'misc.messages.requestError';
            if ( e.error && e.error.errorCode ) {
              if ( e.error.errorCode === 'NO_MATCHING_ENTRY' ) {
                return; // it's ok to continue with the survey
              } else if ( e.error.errorCode === 'ENTRY_ALREADY_HAS_ACCOUNT' ) {
                errorKey = 'volunteer.forms.signup.accountAlreadyExists';
              }
            }
      
            // show an appropriate error message
            this.miscService.showErrorPopup( errorKey );
            throw '';
          });
        }
      }, {
        // page 3: details for a new salesforce entry
        isVisible: vals => !salesforceId,
        fields: [{
          type: SurveyFieldType.TEXT,
          name: 'firstName',
          labelTranslationKey: 'volunteer.forms.signup.labels.firstName',
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          name: 'lastName',
          labelTranslationKey: 'volunteer.forms.signup.labels.lastName',
          isRequired: true
        }]
      }, {
        // page 4
        fields: [{
          type: SurveyFieldType.SELECT,
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
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'mailingAddress'
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'mailingCity'
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'mailingState'
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'mailingZip'
        }]
      }, {
        // page 6
        topTextTranslationKey: 'volunteer.forms.signup.labels.partOfTeam',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'partOfTeam',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        // page 7
        isVisible: vals => vals.partOfTeam === 'yes',
        topTextTranslationKey: 'volunteer.forms.signup.labels.isCoordinator',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'isCoordinator',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }, {
        isVisible: vals => vals.partOfTeam === 'yes' && vals.isCoordinator === 'no',
        topTextTranslationKey: 'volunteer.forms.signup.labels.whatName',
        fields: [{
          type: SurveyFieldType.TEXT,
          name: 'coordinatorName',
          labelTranslationKey: 'volunteer.forms.signup.labels.coordinatorName',
          isRequired: true
        }]
      }],
      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.partOfTeam = vals.partOfTeam === 'yes';
        vals.isCoordinator = vals.isCoordinator === 'yes';
        if ( salesforceId ) {
          vals.salesforceId = salesforceId;
        }

        // the registration code is verified near the beginning of this survey, but that's just a courtesy to the user,
        // so that the user doesn't fill out a long survey just to be stopped by a registration code.
        // the code is needed to authorize the request that actually creates the new account, so it's send with this request.
        // (it's already in 'vals')
        return this.proxyAPI.post( 'createNewUser', vals )
        .then( response => {
          if ( !(response && response.contactId) ) throw '';
        }).catch( e => {
          const errorKey = e.error && e.errorCode === 'INCORRECT_REGISTRATION_CODE' ?
            'volunteer.forms.signup.invalidCode' :
            'misc.messages.requestError';
          // show an error message.
          this.miscService.showErrorPopup( errorKey );
          throw '';
        });
      }
    };
  }


  // a survey to edit volunteer type and default mailing address
  editAccountSurvey() {
    let udata = this.userDataService.data;
    return {
      pages: [{
        // page 1
        fields: [{
          type: SurveyFieldType.SELECT,
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
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.address',
          name: 'mailingAddress',
          defaultValue: udata.address
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: 'mailingCity',
          defaultValue: udata.city
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.state',
          name: 'mailingState',
          defaultValue: udata.state
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: 'mailingZip',
          defaultValue: udata.zip
        }]
      }],
      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'updateUser', vals );
      }
    };
  }


  // makes a POST request to the proxy, and expects a response of `{"success": true}`.
  // Shows an error message alert upon failure.
  private genericProxyPOST( urlSegment: string, payload: object ): Promise<any> {
    return this.proxyAPI.post( urlSegment, payload )
    .then( response => {
      if ( !(response && response.success) ) throw '';
    }).catch( e => {
      this.miscService.showErrorPopup();
      throw '';
    });
  }
}