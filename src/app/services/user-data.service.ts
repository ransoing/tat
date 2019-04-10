import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { StorageKeys, MiscService } from './misc.service';
import { ProxyAPIService } from './proxy-api.service';
import { IUserData, UserDataRequestFlags } from '../models/user-data';


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

  private fetchingUserData: boolean = false;

  constructor(
    private storage: Storage,
    private miscService: MiscService,
    private proxyAPI: ProxyAPIService
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
      await this.miscService.showLoadingPopup();
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
    let url = 'getUserData?parts=' + parts.join( ',' );
    this.proxyAPI.post( url, {firebaseIdToken: token} )
    .then( responses => this.onFetchSuccess(responses) )
    .catch( e => this.onFetchError(e) )
    .finally( () => this.onFetchFinally() );
  }

  private onFetchSuccess( response ) {
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
    if ( this.data.hasCompletedTrainingFeedback ) {
      this.data.hasWatchedTrainingVideos = true;
    }
    this.updateCache();
  }

  private async onFetchError( e ) {
    if ( e.error && e.error.errorCode && e.error.errorCode === 'FIREBASE_USER_NOT_IN_SALESFORCE' ) {
      // this is a new user. Call next on the observable, which alerts other components.
      this.newUserDetected.next();
    } else {
      console.error( e );
      // show an error message.
      this.loadError = true;
      this.miscService.showErrorPopup( 'misc.messages.dataLoadErrorWithTip' );
    }
  }

  private onFetchFinally() {
    this.miscService.hideLoadingPopup();
    this.fetchingUserData = false;
  }


  /**
   * Updates the cache, saving the current state of user data in local storage
   */
  public updateCache() {
    this.storage.set( StorageKeys.USER_DATA, this.data );
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
//       hasWatchedTrainingVideos: false,
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
