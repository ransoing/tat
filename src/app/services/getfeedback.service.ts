import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { TrxService } from './trx.service';
import { UserDataService, IUnfinishedOutreachTarget, OutreachLocationType } from './user-data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class GetFeedbackService {

  getFeedbackSubmitted: Observable<MessageEvent>;

  readonly surveyUrlBases = {
    hoursLog: 'https://www.getfeedback.com/r/NxbLIZ2z',
    preOutreach: 'https://www.getfeedback.com/r/Xquaazy4',
    postOutreach: 'https://www.getfeedback.com/r/dmzvPYwc',
    feedback: 'https://www.getfeedback.com/r/bXD3uX7w',
    signup: 'https://www.getfeedback.com/r/64TbXkbx', // this survey is also used for changing account settings
    trainingVideoFeedback: 'https://www.getfeedback.com/r/KzuLkVb1'
  };
  // it takes several seconds after we submit data until that data is available to get from salesforce via the API
  readonly refreshDataDelay: number = 8000;

  // the nice labels for the different outreach targets. This is required to pre-fill some getfeedback survey fields.
  readonly outreachTargetBackwardsMapping = {
    [OutreachLocationType.CDL_SCHOOL]: 'CDL School',
    [OutreachLocationType.TRUCK_STOP]: 'Truck Stop',
    [OutreachLocationType.TRUCKING_COMPANY]: 'Trucking Company'
  };

  private lastSubmission: number; // timestamp

  constructor(
    private loadingController: LoadingController,
    private userDataService: UserDataService,
    private sanitizer: DomSanitizer,
    private trx: TrxService
  ) {
    // An iframe that contains a getfeedback survey will send a message with a specific signature when done.
    // create an observable for reacting to these events
    this.getFeedbackSubmitted = new Observable( observer => {
      window.addEventListener( 'message', async message => {
        if ( message.data === 'submittedResponse' && message.origin === 'https://www.getfeedback.com' ) {
          this.lastSubmission = Date.now();
          observer.next( message );
        }
      });
    });
  }

  // return a Promise that resolves a certain amount of time after the last GetFeedback survey submission,
  // because it takes several seconds for the data in salesforce to update.
  // This method should only be called after a survey is submitted (and maybe after a success message)
  // and before the user data is fetched (to refresh the local data model)
  waitForSalesforceUpdate(): Promise<null> {
    return new Promise( async (resolve, reject) => {
      let msSinceLastSubmission = Date.now() - this.lastSubmission;
      if ( msSinceLastSubmission >= this.refreshDataDelay ) {
        // more than x seconds have passed since the survey was submitted. Resolve now.
        resolve();
      } else {
        // not enough time has passed. just wait a moment, and show a loading popup while we force the user to wait.
        let loadingPopup = await this.loadingController.create({
          message: await this.trx.t( 'misc.pleaseWait' )
        });
        loadingPopup.present();
        setTimeout( () => {
          loadingPopup.dismiss();
          resolve();
        }, this.refreshDataDelay - msSinceLastSubmission );
      }
    });
  }

  getHoursLogSurveyUrl() {
    return this.makeTrustedUrl( this.surveyUrlBases.hoursLog, {
      'TAT_App_User__cID': this.userDataService.data.salesforceId
    });
  }

  getPreOutreachSurveyUrl() {
    let udata = this.userDataService.data;
    return this.makeTrustedUrl( this.surveyUrlBases.preOutreach, {
      'TAT_App_User__cID': udata.salesforceId,
      'gf_q[7237631][14643527]': udata.address,
      'gf_q[7237631][14643528]': udata.city,
      'gf_q[7237631][14643529]': udata.state,
      'gf_q[7237631][14643530]': udata.zip
    });
  }

  getPostOutreachSurveyUrl( outreachTarget: IUnfinishedOutreachTarget ) {
    return this.makeTrustedUrl( this.surveyUrlBases.postOutreach, {
      'TAT_App_Outreach_Target__cID': outreachTarget.id,
      'gf_q[7238014][14643871]': outreachTarget.name,
      'gf_q[7238014][14643872]': this.outreachTargetBackwardsMapping[outreachTarget.type],
      'gf_q[7238014][14643873]': outreachTarget.address,
      'gf_q[7238014][14643874]': outreachTarget.city,
      'gf_q[7238014][14643875]': outreachTarget.state,
      'gf_q[7238014][14643876]': outreachTarget.zip
    });
  }

  getFeedbackSurveyUrl() {
    return this.makeTrustedUrl( this.surveyUrlBases.feedback, {
      'TAT_App_User__cID': this.userDataService.data.salesforceId
    });
  }

  getSignupSurveyUrl() {
    return this.makeTrustedUrl( this.surveyUrlBases.signup, {
      'gf_q[7290681][14733009]': this.userDataService.firebaseUser.uid,
      'gf_q[7290681][14733014]': this.userDataService.firebaseUser.email,
      'gf_q[7290681][14733013]': this.userDataService.firebaseUser.phoneNumber
    });
  }

  getAccountSettingsSurveyUrl() {
    // uses the same survey as signup, but fills in a bunch of fields and provides a salesforce merge field.
    // The presence of the merge field causes GetFeedback to update a salesforce entry rather than make a new one.
    let udata = this.userDataService.data;
    return this.makeTrustedUrl( this.surveyUrlBases.signup, {
      'TAT_App_User__cID': udata.salesforceId,
      'gf_q[7290681][14733009]': this.userDataService.firebaseUser.uid,
      'gf_q[7290681][14733007]': udata.firstName,
      'gf_q[7290681][14733008]': udata.lastName,
      'gf_q[7290681][14733013]': udata.phone,
      'gf_q[7290681][14733014]': udata.email,
      'gf_q[7290681][14733028]': udata.volunteerType,
      'gf_q[7290682][14733012]': udata.address,
      'gf_q[7290682][14733015]': udata.city,
      'gf_q[7290682][14733016]': udata.state,
      'gf_q[7290682][14733017]': udata.zip
    });
  }

  getTrainingVideoFeedbackSurveyUrl() {
    return this.makeTrustedUrl( this.surveyUrlBases.trainingVideoFeedback, {
      'TAT_App_User__cID': this.userDataService.data.salesforceId
    });
  }

  /**
   * 
   * @param url 
   * @param queryParams Key-value pairs which get converted to a GET query string
   */
  private makeTrustedUrl( url: string, queryParams: Object ) {
    // convert keys and values in the queryParams object to &[key]=[value] URL syntax
    let queryString = Object.keys( queryParams ).reduce( (query, key) => {
      return query + '&' + key + '=' + encodeURIComponent( queryParams[key] );
    }, '' );
    return this.sanitizer.bypassSecurityTrustResourceUrl( url + '?' + queryString );
  }

}