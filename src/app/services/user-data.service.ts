import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'firebase';
import { LoadingController, AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { TrxService } from './trx.service';
import { StorageKeys } from './misc.service';

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
  UNFINISHED_OUTREACH_TARGETS = 4,
  ALL = 7
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
  salesforceId?: string, // ID of the AppUser object in salesforce which represents this user
  firstName?: string,
  lastName?: string,
  volunteerType?: VolunteerType,
  hasWatchedTrainingVideo?: boolean,
  address?: string,
  city?: string,
  state?: string,
  zip?: string,
  phone?: string,
  email?: string,
  hoursLogs?: IHoursLog[],
  unfinishedOutreachTargets?: IUnfinishedOutreachTarget[]
}


// ******************* the service ******************* //
@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  public data: IUserData = null; // the data that comes from salesforce
  public firebaseUser: User;
  public loadError = false;
  public newUserDetected: Subject<null> = new Subject();

  /*
  Possibly useful properties:
  firebaseUser.displayName
  firebaseUser.email
  firebaseUser.phoneNumber
  firebaseUser.refreshToken
  firebaseUser.uid
  */

  private loadingPopup;
  private fetchingUserData: boolean = false;

  constructor(
    private http: HttpClient,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private trx: TrxService,
    private storage: Storage
  ) {}

  /**
   * Fetches the volunteer user data from the proxy, only if it hasn't yet been fetched, or if `force` is set to `true`.
   * Shows a 'loading' popup while data is loading.
   * @param [force] Forces a refresh of the data from the proxy. Otherwise, the app will use the data cache from local storage.
   * @param [dataRequestFlags] Values of UserDataRequestFlags that are OR'd together. 
   */
  async fetchUserData( force?: boolean, dataRequestFlags: number = UserDataRequestFlags.ALL ) {
    this.loadError = false;
    
    if ( this.fetchingUserData ) {
      return;
    }
    this.fetchingUserData = true;

    try {
      if ( !force ) {
        // try to get cached user data from local storage
        if ( !this.data || Object.keys(this.data).length == 0 ) {
          this.data = await this.storage.get( StorageKeys.USER_DATA );
        }
        // if we have data locally, just use that
        if ( this.data ) {
          this.onFetchFinally();
          return;
        }
      }

      // the loading popup might not have been triggered. We need it now.
      await this.showLoadingPopup();
      // get the idToken before a request to the proxy
      var token = await this.firebaseUser.getIdToken();
      
    } catch ( e ) {
      this.onFetchError( e );
      this.onFetchFinally();
    }

    // parse bitmask flags to determine what to append to the URL
    let parts = [];
    if ( dataRequestFlags & UserDataRequestFlags.BASIC_USER_DATA )              parts.push( 'basic' );
    if ( dataRequestFlags & UserDataRequestFlags.HOURS_LOGS )                   parts.push( 'hoursLogs' );
    if ( dataRequestFlags & UserDataRequestFlags.UNFINISHED_OUTREACH_TARGETS )  parts.push( 'unfinishedOutreachTargets' );
    let url = '/getUserData?parts=' + parts.join( ',' );
    this.apiRequest( url, token )
    .then( responses => this.onFetchSuccess(responses) )
    .catch( e => this.onFetchError(e) )
    .finally( () => this.onFetchFinally() );
  }

  private onFetchSuccess( response ) {
    // in some cases, the response can be 200 but completely blank (perhaps some uncaught error in the proxy?)
    if ( typeof response !== 'object' || response === null ) {
      throw new Error( 'Response is not an object: ' + JSON.stringify(response) );
    }
    // convert ISO time strings to Date objects
    this.convertJSONDates( response );
    // save the data. For each key in each response, overwrite the existing key in the saved data.
    if ( !this.data ) {
      this.data = {};
    }
    Object.keys( response ).filter( key => response.hasOwnProperty(key) ).forEach( key => {
      this.data[key] = response[key];
    });
    // sort the hours log entries by descending date
    this.data.hoursLogs = this.data.hoursLogs.sort( (a, b) => {
      if ( a.date.getTime() == b.date.getTime() ) {
        return 0;
      }
      return a.date < b.date ? 1 : -1;
    });
    // save the data in local cache
    this.storage.set( StorageKeys.USER_DATA, this.data );
  }

  private async onFetchError( e ) {
    if ( e.error && e.error.errorCode && e.error.errorCode === 'FIREBASE_USER_NOT_IN_SALESFORCE' ) {
      // this is a new user. Call next on the observable, which alerts other components.
      this.newUserDetected.next();
    } else {
      console.error( e );
      // show an error message.
      this.loadError = true;
      const alert = await this.alertController.create({
        header: await this.trx.t( 'misc.error' ),
        message: await this.trx.t( 'misc.dataLoadErrorWithTip' ),
        buttons: [await this.trx.t( 'misc.close' )]
      });
      alert.present();
    }
  }

  private onFetchFinally() {
    this.hideLoadingPopup();
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

  /**
   * Shows the loading popup, but only if it isn't yet shown.
   */
  private async showLoadingPopup() {
    if ( this.loadingPopup ) {
      // quit now; it's already been presented.
      return;
    }
    // create and preset the loading popup
    this.loadingPopup = await this.loadingController.create({
      message: await this.trx.t( 'misc.pleaseWait' )
    });
    this.loadingPopup.present();
  }

  /**
   * Only tries to hide the loading popup if the thing exists
   */
  private async hideLoadingPopup() {
    if ( this.loadingPopup ) {
      this.loadingPopup.dismiss();
      this.loadingPopup = null;
    }
  }

  public clearData() {
    this.firebaseUser = null;
    this.data = null;
    this.storage.remove( StorageKeys.USER_DATA ); // clear the cache; a new user's data might be fetched
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
