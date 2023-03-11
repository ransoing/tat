// only import models and interfaces. If I imported services, then tsc and webpack would try to bundle
// all of those and their dependencies together with this, and the resulting file would be large.
// Interfaces are not included in the compiled js -- importing them only helps with code hinting and
// compile-time error checking.

import { ISurvey, ISurveyPageFunc, SurveyFieldType } from '../../src/app/models/survey';
import { IOutreachLocation, OutreachLocationType, VolunteerType } from '../../src/app/models/user-data';
import { IUserDataService, IProxyAPIService, IMiscService, ITrxService } from '../../src/app/models/services';

class SurveyService {

  constructor(
    private userDataService: IUserDataService,
    private proxyAPI: IProxyAPIService,
    private miscService: IMiscService,
    private trx: ITrxService
  ) {}

  private _yesNoOptions = [
    { value: 'yes', labelTranslationKey: 'misc.buttons.yes' },
    { value: 'no', labelTranslationKey: 'misc.buttons.no' }
  ];


  async preOutreachSurvey( numLocations: number ): Promise<ISurvey> {
    const udata = this.userDataService.data;

    // retrieve a list of the user's campaigns, and ask the user which campaign this pre-outreach survey is for.
    const campaigns = await this.proxyAPI.post( 'getCampaigns', {firebaseIdToken: await this.userDataService.firebaseUser.getIdToken()} );
    campaigns.sort( (a, b) => a.daysSinceCreated - b.daysSinceCreated );
    if ( campaigns.length === 0 ) {
      throw 'volunteer.forms.preOutreach.noCampaignsError';
    } else if ( campaigns.length > 1 ) {
      throw 'volunteer.forms.preOutreach.tooManyCampaignsError';
    }

    // add a campaign selection page
    let pages: ISurveyPageFunc[] = [() => { return {
      topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatCampaign',
      fields: [{
        type: SurveyFieldType.CHOICE,
        name: 'campaignId',
        isRequired: true,
        multi: false,
        options: campaigns.map( campaign => {
          return { value: campaign.salesforceId, label: campaign.name }
        })
      }]
    }}];

    // Collect info for each location the team is going to visit. This requires duplicating some of the pages.
    const createLocationPages = async ( locationNumber: number ): Promise<ISurveyPageFunc[]> => {
      const titleText = (await this.trx.t('volunteer.forms.preOutreach.labels.location', {num: locationNumber + 1}) );
      const titleTextCont = (await this.trx.t('volunteer.forms.preOutreach.labels.locationCont', {num: locationNumber + 1}) );
      return [() => { return {
        titleText: titleText,
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatLocation',
        fields: [{
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationName',
          name: `locations[${locationNumber}].name`,
          isRequired: true
        }, {
          type: SurveyFieldType.SELECT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationType',
          name: `locations[${locationNumber}].type`,
          options: [
            { value: OutreachLocationType.CDL_SCHOOL, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.cdlSchool' },
            { value: OutreachLocationType.SCHOOL_BUS, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.schoolBus' },
            { value: OutreachLocationType.TRANSIT_COMPANY, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.transitCompany' },
            { value: OutreachLocationType.TRUCK_STOP, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckStop' },
            { value: OutreachLocationType.TRUCKING_COMPANY, labelTranslationKey: 'volunteer.forms.preOutreach.labels.locationTypes.truckingCompany' },
          ],
          isRequired: true
        }, {
          type: SurveyFieldType.COUNTRY,
          labelTranslationKey: 'misc.location.country',
          name: `locations[${locationNumber}].country`,
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.street',
          name: `locations[${locationNumber}].street`,
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.city',
          name: `locations[${locationNumber}].city`,
          isRequired: true
        }, {
          type: SurveyFieldType.STATE,
          labelTranslationKey: 'misc.location.state',
          name: `locations[${locationNumber}].state`,
          countryDropdownName: `locations[${locationNumber}].country`,
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'misc.location.zip',
          name: `locations[${locationNumber}].zip`,
          isRequired: true
        }, {
          preFieldTextTranslationKey: 'volunteer.forms.preOutreach.labels.plannedDate',
          type: SurveyFieldType.DATE,
          labelTranslationKey: 'misc.datetime.date',
          name: `locations[${locationNumber}].date`,
          isRequired: true,
          min: new Date().getFullYear().toString(),
          max: ( new Date().getFullYear() + 2 ).toString()
        }]
      }}, () => { return {
        titleText: titleTextCont,
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.haveYouContacted',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: `locations[${locationNumber}].hasContactedManager`,
          options: this._yesNoOptions,
          isRequired: true
        }]
      }}, () => { return {
        isVisible: ((num) => {
          return vals => vals[`locations[${num}].hasContactedManager`] === 'yes'
        })( locationNumber ),
        titleText: titleTextCont,
        topTextTranslationKey: 'volunteer.forms.preOutreach.labels.contactInfo',
        fields: [{
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'volunteer.forms.signup.labels.firstName',
          name: `locations[${locationNumber}].contactFirstName`,
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'volunteer.forms.signup.labels.lastName',
          name: `locations[${locationNumber}].contactLastName`,
          isRequired: true
        }, {
          type: SurveyFieldType.TEXT,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.contactTitle',
          name: `locations[${locationNumber}].contactTitle`,
        }, {
          type: SurveyFieldType.EMAIL,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.contactEmail',
          name: `locations[${locationNumber}].contactEmail`,
        }, {
          type: SurveyFieldType.TEL,
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.contactPhone',
          name: `locations[${locationNumber}].contactPhone`,
        }]
      }}];
    };

    for ( let i = 0; i < numLocations; i++ ) {
      pages = pages.concat( await createLocationPages(i) );
    }

    pages = pages.concat([() => { return {
      topTextTranslationKey: 'volunteer.forms.preOutreach.labels.areYouReady',
      fields: [{
        type: SurveyFieldType.CHOICE,
        name: 'isReadyToReceive',
        options: this._yesNoOptions,
        isRequired: true
      }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatAddress',
      isVisible: vals => vals.isReadyToReceive === 'yes',
      fields: [{
        type: SurveyFieldType.COUNTRY,
        labelTranslationKey: 'misc.location.country',
        name: 'mailingCountry',
        isRequired: true,
        defaultValue: udata.country
      }, {
        type: SurveyFieldType.TEXT,
        labelTranslationKey: 'misc.location.street',
        name: 'mailingStreet',
        isRequired: true,
        defaultValue: udata.street
      }, {
        type: SurveyFieldType.TEXT,
        labelTranslationKey: 'misc.location.city',
        name: 'mailingCity',
        isRequired: true,
        defaultValue: udata.city
      }, {
        type: SurveyFieldType.STATE,
        labelTranslationKey: 'misc.location.state',
        name: 'mailingState',
        countryDropdownName: 'mailingCountry',
        isRequired: true,
        defaultValue: udata.state
      }, {
        type: SurveyFieldType.TEXT,
        labelTranslationKey: 'misc.location.zip',
        name: 'mailingZip',
        isRequired: true,
        defaultValue: udata.zip
      }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.preOutreach.labels.equippedForOutreach',
      fields: [{
        type: SurveyFieldType.CHOICE,
        name: 'feelsPrepared',
        options: this._yesNoOptions,
        isRequired: true
      }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatQuestions',
      fields: [{
        type: SurveyFieldType.TEXTAREA,
        name: 'questions'
      }]
    }}]);

    return {
      pages: pages,
      onSubmit: async vals => {
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        // convert some yes/no values to booleans, and convert all numbered fields to an array.
        vals.locations = [];
        // find the values which have a name that looks like an array/object access, like `locations[1].name`
        // Turn it into an actual array of objects
        for ( let i = 0; i < numLocations; i ++ ) {
          const newLocation: any = {};
          const regex = new RegExp( '^locations\\[' + i + '\\]\\.(.+)' );
          Object.keys( vals ) // get all key names
          .filter( key => key.match(regex) ) // get only the ones for this location index
          .map( key => key.match(regex) ) // parse the key name
          .forEach( match => {
            // add the value to the location object
            // i.e. newLocation[ 'type' ] = vals[ 'locations[0].type' ];
            newLocation[ match[1] ] = vals[ match[0] ];
            // remove the key from the original `vals` object
            delete vals[ match[0] ];
          });

          newLocation.hasContactedManager = newLocation.hasContactedManager === 'yes';
          newLocation.date = this.miscService.dateToLocalYYYYMMDD( newLocation.date );

          vals.locations.push( newLocation );
        }

        vals.isReadyToReceive = vals.isReadyToReceive === 'yes';
        vals.feelsPrepared = vals.feelsPrepared === 'yes';

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createPreOutreachSurvey', vals );
      }
    };
  }


  async postOutreachSurvey( location: IOutreachLocation ): Promise<ISurvey> {
    return {
      pages: [() => { return {
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.when',
        fields: [{
          type: SurveyFieldType.DATE,
          name: 'completionDate',
          labelTranslationKey: 'misc.datetime.date',
          isRequired: true,
          min: ( new Date().getFullYear() - 2 ).toString(),
          defaultValue: new Date( Date.now() - new Date().getTimezoneOffset() * 60 * 1000 ).toISOString()
        }]
      }}, () => { return {
        // truck stop
        isVisible: vals => location.type === OutreachLocationType.TRUCK_STOP,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          options: [{
            value: 'willDistributeMaterials',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.willDistributeMaterials'
          }, {
            value: 'willTrainEmployees',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckStop.willTrainEmployees'
          }]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }}, () => { return {
        // CDL school
        isVisible: vals => location.type === OutreachLocationType.CDL_SCHOOL,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          options: [{
            value: 'willUseTatTraining',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.cdlSchool.willUseTatTraining'
          }]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }}, () => { return {
        // Transit company or School bus
        isVisible: vals => location.type === OutreachLocationType.TRANSIT_COMPANY || location.type === OutreachLocationType.SCHOOL_BUS,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          options: [{
            value: 'busHangPoster',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.busTransit.busHangPoster'
          }, {
            value: 'busShowVideo',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.busTransit.busShowVideo'
          }]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }}, () => { return {
        // trucking company
        isVisible: vals => location.type === OutreachLocationType.TRUCKING_COMPANY,
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whichAccomplishments',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'accomplishments',
          multi: true,
          options: [{
            value: 'willTrainDrivers',
            labelTranslationKey: 'volunteer.forms.postOutreach.labels.truckingCompany.willTrainDrivers'
          }]
        }, {
          type: SurveyFieldType.TEXTAREA,
          name: 'otherAccomplishments',
          labelTranslationKey: 'misc.other'
        }]
      }}, () => { return {
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.whoContact',
        canContinue: vals => {
          return !!( String( vals.contactPhone ).trim() || String( vals.contactEmail ).trim() );
        },
        fields: [{
          type: SurveyFieldType.TEXT,
          name: 'contactFirstName',
          labelTranslationKey: 'volunteer.forms.signup.labels.firstName',
          isRequired: true,
          defaultValue: location.contact.firstName
        }, {
          type: SurveyFieldType.TEXT,
          name: 'contactLastName',
          labelTranslationKey: 'volunteer.forms.signup.labels.lastName',
          isRequired: true,
          defaultValue: location.contact.lastName
        }, {
          type: SurveyFieldType.TEXT,
          name: 'contactTitle',
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.contactTitle',
          isRequired: true,
          defaultValue: location.contact.title
        }, {
          type: SurveyFieldType.EMAIL,
          name: 'contactEmail',
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.contactEmail',
          defaultValue: location.contact.email
        }, {
          type: SurveyFieldType.TEL,
          name: 'contactPhone',
          labelTranslationKey: 'volunteer.forms.preOutreach.labels.contactPhone',
          defaultValue: location.contact.phone
        }]
      }}, () => { return {
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUp',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'willFollowUp',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }}, () => { return {
        isVisible: vals => vals.willFollowUp === 'yes',
        topTextTranslationKey: 'volunteer.forms.postOutreach.labels.followUpWhen',
        fields: [{
          type: SurveyFieldType.DATE,
          name: 'followUpDate',
          labelTranslationKey: 'volunteer.forms.postOutreach.labels.followUpDate',
          isRequired: true,
          min: ( new Date().getFullYear() ).toString(),
          max: ( new Date().getFullYear() +2 ).toString()
        }]
      }}, () => { return {
        topTextTranslationKey:
          this.userDataService.data.isOnVolunteerTeam ?
          'volunteer.forms.postOutreach.labels.hoursQuestion.group' :
          'volunteer.forms.postOutreach.labels.hoursQuestion.individual',
        fields: [{
          type: SurveyFieldType.NUMBER,
          name: 'totalHours',
          labelTranslationKey: 'volunteer.forms.postOutreach.labels.hours',
          isRequired: true,
          min: 0
        }]
      }}],
      onSubmit: async vals => {
        // alter some values before sending to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.willFollowUp = vals.willFollowUp === 'yes';
        vals.followUpDate = this.miscService.dateToLocalYYYYMMDD( vals.followUpDate );
        vals.completionDate = this.miscService.dateToLocalYYYYMMDD( vals.completionDate );
        vals.outreachLocationId = location.id;
        // turn 'accomplishments' into an array
        vals.accomplishments = vals.accomplishments.split( '; ' );

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createPostOutreachReport', vals );
      }
    };
  }


  // preEventSurvey


  // postEventSurvey


  // a feedback survey may be associated with a campaign. If the campaign isn't defined by the parameter,
  // the user will be prompted to select one from a list.
  async testimonialFeedbackSurvey( campaignId?: string ): Promise<ISurvey> {
    const feedbackSurveyPages: ISurveyPageFunc[] = [];

    if ( !campaignId ) {
      // retrieve a list of the user's campaigns, and ask the user which campaign this pre-outreach survey is for.
      const campaigns = await this.proxyAPI.post( 'getCampaigns', {
          firebaseIdToken: await this.userDataService.firebaseUser.getIdToken()
      });
      campaigns.sort( (a, b) => a.daysSinceCreated - b.daysSinceCreated );

      // add a campaign selection page
      if ( campaigns.length > 0 ) {
        const options = campaigns.map( campaign => {
          return { value: campaign.salesforceId, label: campaign.name }
        });
        options.push({ value: 'a', labelTranslationKey: 'misc.none' });

        feedbackSurveyPages.push( () => { return {
          topTextTranslationKey: 'volunteer.forms.preOutreach.labels.whatCampaign',
          fields: [{
            type: SurveyFieldType.CHOICE,
            name: 'campaignId',
            isRequired: true,
            multi: false,
            options: options
          }]
        }});
      }
    }

    feedbackSurveyPages.push( () => { return {
      topTextTranslationKey: 'volunteer.forms.feedback.labels.whatAdvice',
      fields: [{ type: SurveyFieldType.TEXTAREA, name: 'advice' }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.feedback.labels.bestPart',
      fields: [{ type: SurveyFieldType.TEXTAREA, name: 'bestPart' }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.feedback.labels.improvements',
      fields: [{ type: SurveyFieldType.TEXTAREA, name: 'improvements' }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.feedback.labels.giveAnonPermission',
      fields: [{
        type: SurveyFieldType.CHOICE,
        name: 'givesAnonPermission',
        isRequired: true,
        options: this._yesNoOptions
      }]
    }}, () => { return {
      topTextTranslationKey: 'volunteer.forms.feedback.labels.giveNamePermission',
      fields: [{
        type: SurveyFieldType.CHOICE,
        name: 'givesNamePermission',
        isRequired: true,
        options: this._yesNoOptions
      }]
    }});

    return {
      pages: feedbackSurveyPages,
      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.givesAnonPermission = vals.givesAnonPermission === 'yes';
        vals.givesNamePermission = vals.givesNamePermission === 'yes';

        // include the campaign ID if it was passed as a parameter
        if ( campaignId ) {
          vals.campaignId = campaignId;
        }

        // send to the proxy and show an error message if appropriate
        return this.genericProxyPOST( 'createFeedback', vals );
      }
    };
  }


  async signupSurvey(): Promise<ISurvey> {
    let salesforceId: string,
      volunteerType: string,
      // options for volunteer distributors
      isIndividualDistributor: boolean,
      coordinatorOptions: { label: string, value: string }[];

    return {
      pages: [() => { return {
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
            if ( !response || !response.success ) {
                throw '';
            }
            volunteerType = response.volunteerType;
            if ( volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR ) {
              // save some info to use later in the survey
              isIndividualDistributor = response.isIndividualDistributor;
              if ( !isIndividualDistributor ) {
                coordinatorOptions = response.teamCoordinators.map( coordinator => {
                  return { label: coordinator.name, value: coordinator.salesforceId };
                });
              }
            } else if ( volunteerType === VolunteerType.AMBASSADOR_VOLUNTEER ) {
              // @@
            } else {
              console.error( 'Unknown volunteer type: ' + volunteerType );
              throw '';
            }
          }).catch( e => {
            // check the error code to show an appropriate message
            let errorKey;
            if ( e.status === 0 ) {
              errorKey = 'misc.messages.requestErrorNetwork';
            } else if ( e.error && e.error.errorCode && e.error.errorCode === 'INCORRECT_REGISTRATION_CODE' ) {
              errorKey = 'volunteer.forms.signup.invalidCode';
            } else {
              errorKey = 'misc.messages.requestErrorUnknown';
            }
            // show an error message.
            throw this.miscService.showErrorPopup( errorKey );
          });
        }
      }}, () => { return {
        // page 2
        topTextTranslationKey: 'volunteer.forms.signup.labels.intro',
        fields: [{
          type: SurveyFieldType.EMAIL,
          name: 'email',
          labelTranslationKey: 'volunteer.forms.signup.labels.email',
          isRequired: true,
          defaultValue: this.userDataService.firebaseUser.email
        }, {
          type: SurveyFieldType.TEL,
          name: 'phone',
          labelTranslationKey: 'volunteer.forms.signup.labels.phone',
          isRequired: true
        }],
        onContinue: vals => {
          salesforceId = undefined;
          // search for whether there is an existing salesforce Contact that matches the phone/email
          // it's ok to continue if:
          //   * for individual volunteer distributors and TAT ambassadors: there must be a matching Contact in SF
          //   * for group volunteer distributors: there may either be a matching Contact in SF, or no matching Contact in SF
          // in any case, it's not ok to continue if there is a matching Contact in SF that is already associated with an app user account.
          return this.proxyAPI.get( 'contactSearch?email=' + encodeURIComponent(vals.email) + '&phone=' + encodeURIComponent(vals.phone) )
          .then( response => {
            if ( response && response.salesforceId ) {
              // found a matching Contact in SF, who does not yet have an associated app user account)
              salesforceId = response.salesforceId;
              return;
            } else {
                throw ''; // unexpected error
            }
          }).catch( e => {
            // check error code and show an error message if appropriate
            let errorKey = 'misc.messages.requestErrorUnknown';
            if ( e.status === 0 ) {
              errorKey = 'misc.messages.requestErrorNetwork';
            } else if ( e.error && e.error.errorCode ) {
              if ( e.error.errorCode === 'NO_MATCHING_ENTRY' ) {
                if ( volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR && !isIndividualDistributor ) {
                  return; // it's ok to continue with the survey. A new SF Contact will be created
                } else {
                  errorKey = 'volunteer.forms.signup.cannotFindContact';
                }
              } else if ( e.error.errorCode === 'ENTRY_ALREADY_HAS_ACCOUNT' ) {
                // Contact already exists in SF, and is associated with an app user account
                errorKey = 'volunteer.forms.signup.accountAlreadyExists';
              }
            }

            // show an appropriate error message
            this.miscService.showErrorPopup( errorKey );
            throw '';
          });
        }
      }}, () => { return {
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
      }}, () => { return {
        // page 4
        isVisible: () => volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR && !isIndividualDistributor,
        topTextTranslationKey: 'volunteer.forms.signup.labels.isCoordinator',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'isCoordinator',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }}, () => { return {
        // page 5
        isVisible: vals => volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR && !isIndividualDistributor && vals.isCoordinator === 'no',
        topTextTranslationKey:
          !coordinatorOptions || coordinatorOptions.length === 0 ?
          'volunteer.forms.signup.labels.noCoordinators' :
          'volunteer.forms.signup.labels.whatName',
        fields: !coordinatorOptions || coordinatorOptions.length === 0 ? [] : [{
          type: SurveyFieldType.SELECT,
          name: 'coordinatorId',
          labelTranslationKey: 'volunteer.forms.signup.labels.coordinatorName',
          isRequired: true,
          options: coordinatorOptions
        }]
      }}, () => { return {
        isVisible: vals => volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR && !isIndividualDistributor && vals.isCoordinator === 'yes',
        topTextTranslationKey: 'volunteer.forms.signup.labels.trainingVideo',
        fields: [{
          type: SurveyFieldType.CHOICE,
          name: 'trainingVideoRequiredForTeam',
          isRequired: true,
          options: this._yesNoOptions
        }]
      }}],
      onSubmit: async vals => {
        // modify some of the form values before submitting to the proxy
        vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
        vals.isCoordinator = vals.isCoordinator === 'yes';
        vals.trainingVideoRequiredForTeam = vals.trainingVideoRequiredForTeam === 'yes';
        vals.coordinatorId = vals.coordinatorId || ''; // the value may be undefined because it's hidden in some cases
        if ( salesforceId ) {
          vals.salesforceId = salesforceId;
        }

        // the registration code is verified near the beginning of this survey, but that's just a courtesy to the user,
        // so that the user doesn't fill out a long survey just to be stopped by a registration code.
        // the code is needed to authorize the request that actually creates the new account, so it's sent with this request.
        // (it's already in 'vals')
        return this.proxyAPI.post( 'createNewUser', vals )
        .then( response => {
          if ( !(response && response.contactId) ) {
              throw '';
          }
        }).catch( e => {
          let errorKey;
          if ( e.status === 0 ) {
            errorKey = 'misc.messages.requestErrorNetwork';
          } else if ( e.error && e.errorCode === 'INCORRECT_REGISTRATION_CODE' ) {
            errorKey = 'volunteer.forms.signup.invalidCode';
          } else {
            errorKey = 'misc.messages.requestErrorUnknown';
          }
          // show an error message.
          this.miscService.showErrorPopup( errorKey );
          throw '';
        });
      }
    };
  }


  // a survey to edit some account settings
  // @@ if more options are added to this survey, edit volunteer-settings.component.html so that more volunteer types
  // @@ can see the button to pop up this survey
  async editAccountSurvey(): Promise<ISurvey> {
    const udata = this.userDataService.data;
    return this.getTeamCoordinators( udata.accountId ).then( coordinatorOptions => {
      return {
        pages: [() => { return {
          // page 1
          isVisible: vals => this.userDataService.data.volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR && !this.userDataService.data.isTeamCoordinator && this.userDataService.data.isOnVolunteerTeam,
          topTextTranslationKey: 'volunteer.forms.signup.labels.whatName',
          fields: [{
            type: SurveyFieldType.SELECT,
            name: 'coordinatorId',
            labelTranslationKey: 'volunteer.forms.signup.labels.coordinatorName',
            isRequired: true,
            defaultValue: this.userDataService.data.teamCoordinatorId,
            options: coordinatorOptions
          }]
        }}, () => { return {
          // page 2
          isVisible: vals => this.userDataService.data.volunteerType === VolunteerType.VOLUNTEER_DISTRIBUTOR && this.userDataService.data.isTeamCoordinator && this.userDataService.data.isOnVolunteerTeam,
          topTextTranslationKey: 'volunteer.forms.signup.labels.trainingVideo',
          fields: [{
            type: SurveyFieldType.CHOICE,
            name: 'trainingVideoRequiredForTeam',
            isRequired: true,
            defaultValue: this.userDataService.data.trainingVideoRequiredForTeam ? 'yes' : 'no',
            options: this._yesNoOptions
          }]
        }}],
        onSubmit: async vals => {
          // modify some of the form values before submitting to the proxy
          vals.firebaseIdToken = await this.userDataService.firebaseUser.getIdToken();
          if ( vals.trainingVideoRequiredForTeam !== undefined ) {
            vals.trainingVideoRequiredForTeam = vals.trainingVideoRequiredForTeam === 'yes';
          }

          // send to the proxy and show an error message if appropriate
          return this.genericProxyPOST( 'updateUser', vals );
        }
      };
    });
  }


  // makes a POST request to the proxy, and expects a response of `{"success": true}`.
  // Shows an error message alert upon failure.
  private genericProxyPOST( urlSegment: string, payload: object ): Promise<any> {
    return this.proxyAPI.post( urlSegment, payload )
    .then( response => {
      if ( !(response && response.success) ) {
          throw '';
      }
    }).catch( e => {
      this.miscService.showErrorPopup( e.status === 0 ? 'misc.messages.requestErrorNetwork' : 'misc.messages.requestErrorUnknown' );
      throw '';
    });
  }

  private getTeamCoordinators( accountId: string ): Promise<any> {
    return this.proxyAPI.get( 'getTeamCoordinators?accountId=' + accountId )
    .then( teamCoordinators => {
      return teamCoordinators.map( coordinator => {
        return { label: coordinator.name, value: coordinator.salesforceId };
      });
    })
    .catch( e => {
      this.miscService.showErrorPopup( e.status === 0 ? 'misc.messages.requestErrorNetwork' : 'misc.messages.requestErrorUnknown' );
      throw '';
    });
  }
}

// put the object on the window so it can be used in other components or scripts
window['ExternalSurveyService'] = SurveyService;
