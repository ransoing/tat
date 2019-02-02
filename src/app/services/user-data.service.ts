import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'firebase';
import { LoadingController, AlertController } from '@ionic/angular';
import { TrxService } from './trx.service';

/**
 * This service doesn't communicate directly with Salesforce (SF), but communicates with a
 * proxy which communicates with Salesforce. The reason for this is that access to Salesforce
 * data requires a Salesforce username/password combo, and we don't want to make a SF user
 * account for every TAT volunteer, nor do we want every volunteer to use a shared account,
 * because then the client HTTP requests could be analyzed and modified to scrape data on all
 * TAT volunteers and contacts from the SF database.
 * 
 * Instead, only the proxy has the SF username/password, and has access to all SF data.
 * The user authenticates with Firebase inside the app, and the user's email and auth token
 * are sent to the proxy. If the credentials are correct, then the proxy filters the data from
 * SF so that user can retrieve only the data about himself.
 * 
 * The proxy can only get data -- it can't make changes to the salesforce database.
*/


// ******************* enums and interfaces used by the service ******************* //
export enum VolunteerType {
  TRUCK_STOP_VOLUNTEER = 'truckStopVolunteer',
  EVENT_VOLUNTEER = 'freedomDriversVolunteer',
  AMBASSADOR_VOLUNTEER = 'ambassadorVolunteer'
}

export enum OutreachLocationType {
  CDL_SCHOOL = 'cdlSchool',
  TRUCKING_COMPANY = 'truckingCompany',
  TRUCK_STOP = 'truckStop'
}

// bitmask flags for passing into fetchUserData()
export enum UserDataRequestFlags {
  BASIC_USER_DATA = 1,
  HOURS_LOGS = 2,
  UNFINISHED_OUTREACH_TARGETS = 4
}

export interface IHoursLog {
  taskDescription: string,
  date: Date,
  numHours: number
}

export interface IPostOutreachReport {
  followUpDate: Date | null
}

// If the user filled out a pre-outreach or pre-event survey, there will be an "incomplete post-report"
// until they submit the post-report
export interface IUnfinishedOutreachTarget {
  id: string, // ID of the object in salesforce
  name: string, // name of the location
  type: OutreachLocationType,
  address: string, // street address
  city: string,
  state: string,
  zip: string,
  postReports: IPostOutreachReport[]
}

export interface IUserData {
  salesforceId?: string, // ID of the Contact object in salesforce which represents this user
  volunteerType?: VolunteerType,
  hasWatchedTrainingVideo?: boolean,
  hoursLogs?: IHoursLog[],
  unfinishedOutreachTargets?: IUnfinishedOutreachTarget[]
}


// ******************* the service ******************* //
@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  public firebaseUser: User;
  /*
  Possibly useful properties:
  firebaseUser.displayName
  firebaseUser.email
  firebaseUser.phoneNumber
  firebaseUser.refreshToken
  firebaseUser.uid
  */

  data: IUserData = null;
  loadingPopup;
  fetchingUserData: boolean = false;

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private trx: TrxService
  ) { }

  /**
   * Fetches the volunteer user data, only if it hasn't yet been fetched, or if `force` is set to `true`.
   * @param [force]
   * @param [dataRequestFlags] Values of UserDataRequestFlags that are OR'd together. 
   */
  async fetchUserData(
      force?: boolean,
      dataRequestFlags: number = UserDataRequestFlags.BASIC_USER_DATA | UserDataRequestFlags.HOURS_LOGS | UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS
    ) {
    // @@TODO: keep a cache of this, stored in permanent local storage. This method will check if the cache is expired
    // quit now if we've already gotten the data and the caller of this function isn't forcing a refresh,
    // and we're not currently fetching the data already
    if ( (this.data && !force) || this.fetchingUserData ) {
      return;
    }

    this.fetchingUserData = true;
    
    // show a loading thing while we're loading data
    this.loadingPopup = await this.loadingController.create({
      message: await this.trx.t( 'misc.pleaseWait' )
    });
    this.loadingPopup.present();
    
    let token;
    try {
      // get the idToken before a request to the proxy
      token = await this.firebaseUser.getIdToken();
    } catch ( e ) {
      this.onFetchError( e );
      this.onFetchFinally();
    }

    let promises = [];
    // parse bitmask flags to determine which URLs to hit
    if ( dataRequestFlags & UserDataRequestFlags.BASIC_USER_DATA )              promises.push( this.apiRequest( '/getBasicUserData', token ) );
    if ( dataRequestFlags & UserDataRequestFlags.HOURS_LOGS )                   promises.push( this.apiRequest( '/getHoursLogs', token ) );
    if ( dataRequestFlags & UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS )  promises.push( this.apiRequest( '/getUnfinishedOutreachTargets', token ) );
    Promise.all( promises )
    .then( responses => this.onFetchSuccess(responses) )
    .catch( e => this.onFetchError(e) )
    .finally( () => this.onFetchFinally() );
  }

  private onFetchSuccess( responses ) {
    // convert ISO time strings to Date objects
    this.convertJSONDates( responses );
    // save the data. For each key in each response, overwrite the existing key in the saved data.
    if ( !this.data ) {
      this.data = {};
    }
    responses.forEach( response => {
      Object.keys( response ).filter( key => response.hasOwnProperty(key) ).forEach( key => {
        this.data[key] = response[key];
      });
    });
    // @@TODO: don't use a hardcoded salesforce user ID
    this.data.salesforceId = '0031N00001tVsAmQAK';
  }

  private async onFetchError( e ) {
    console.error( e );
    const alert = await this.alertController.create({
      header: await this.trx.t( 'misc.error' ),
      message: await this.trx.t( 'misc.dataLoadError' ),
      buttons: [await this.trx.t( 'misc.close' )]
    });
    alert.present();
  }

  private onFetchFinally() {
    this.loadingPopup.dismiss();
    this.fetchingUserData = false;
  }

  // takes a part of the API url, like '/getBasicUserData`.
  // makes a POST request to the API and returns a promise.
  private apiRequest( urlSegment: string, firebaseToken: string ) {
    return this.http.post(
      environment.proxyServerURL + urlSegment,
      { firebaseIdToken: firebaseToken },
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    ).toPromise();
  }

  private convertJSONDates( object ) {
    Object.keys( object )
    .filter( key => {
      return object.hasOwnProperty( key );
    })
    .forEach( key => {
      let val = object[key];
      if ( typeof val === 'object' && val !== null ) {
        this.convertJSONDates( val );
      // if the string looks like ISO-8601 date or a YYYY-MM-DD date, convert it to a Date object
      } else if ( typeof val === 'string' ) {
        if ( val.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) ) {
          object[key] = new Date( val );
        } else if ( val.match(/\d{4}-\d{2}-\d{2}/) ) {
          // adding a time prevents timezone-based parsing errors
          object[key] = new Date( val + 'T00:00:00' );
        }
      }
    })
  }

}


// ******************* mock service ******************* //

// @Injectable({
//   providedIn: 'root',
// })
// export class MockUserDataService {

//   data: IUserData;
//   fetchingUserData: Boolean;

//   constructor() {}

//   async fetchUserData( force?: boolean ) {
//     // quit now if we've already gotten the data and the caller of this function isn't forcing a refresh,
//     // and we're not currently fetching the data already
//     if ( (this.data && !force) || this.fetchingUserData ) {
//       return;
//     }

//     this.fetchingUserData = true;
//     // invalidate the current data until we get new data
//     this.data = null;
//     this.onFetchSuccess();
//   }

//   onFetchSuccess() {
//     // return some fake data.
//     this.data = {
//       volunteerType: VolunteerType.truckStopVolunteer,
//       hasWatchedTrainingVideo: false,
//       hoursLogs: [
//         {
//           taskDescription: 'Handed out TAT flyers to every truck stop in Nebraska',
//           date: new Date('11/29/2018'),
//           numHours: 14
//         }, {
//           taskDescription: 'Convinced the manager at Love\'s to train 1000 employees.',
//           date: new Date('11/15/2018'),
//           numHours: 3
//         }
//       ],
//       incompletePostReports: [
//         { title: 'Some truck stop' },
//         { title: 'Some other truck stop' }
//       ]
//     };

//     this.fetchingUserData = false;
//   }

// }
