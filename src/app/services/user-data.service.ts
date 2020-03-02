import { Injectable } from '@angular/core';
import { User } from 'firebase';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { StorageKeys, MiscService } from './misc.service';
import { ProxyAPIService } from './proxy-api.service';
import { IUserData, UserDataRequestFlags } from '../models/user-data';
import { environment } from '../../environments/environment';
import { IUserDataService } from '../models/services';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService implements IUserDataService {

  public data: IUserData = null; // the data that comes from salesforce
  public firebaseUser: User;
  public loadError = false;
  public newUserDetected: Subject<null> = new Subject();
  public fetchingUserData: boolean = false;
  private fetchingPromise: Promise<IUserData>;

  /*
  Possibly useful properties:
  firebaseUser.displayName
  firebaseUser.email
  firebaseUser.phoneNumber
  firebaseUser.refreshToken
  firebaseUser.uid
  */

  constructor(
    private storage: Storage,
    private miscService: MiscService,
    private proxyAPI: ProxyAPIService,
    private firebase: FirebaseX,
    private settings: SettingsService,
    private proxyApiService: ProxyAPIService
  ) {}

  /**
   * Fetches the volunteer user data from the proxy, only if it hasn't yet been fetched, or if `force` is set to `true`.
   * Shows a 'loading' popup while data is loading.
   * @param [force] Forces a refresh of the data from the proxy. Otherwise, the app will use the data cache from local storage.
   * @param [dataRequestFlags] Values of UserDataRequestFlags that are OR'd together.
   */
  async fetchUserData( force?: boolean, dataRequestFlags: number = UserDataRequestFlags.ALL, showLoading = true ): Promise<IUserData> {
    this.loadError = false;

    if ( this.needsToVerifyEmail() ) {
      throw new Error( 'MUST_VERIFY_EMAIL' );
    }

    if ( this.fetchingUserData ) {
      return this.fetchingPromise;
    }
    this.fetchingUserData = true;
    this.fetchingPromise = new Promise( async (resolve, reject) => {
      try {
        if ( !force ) {
          // try to get cached user data from local storage
          if ( !this.data || Object.keys(this.data).length === 0 ) {
            this.data = await this.storage.get( StorageKeys.USER_DATA );
            // storage on mobile devices converts Dates to strings. Ensure that they are converted back to Date objects
            if ( this.data ) {
              this.data = this.proxyAPI.convertJSONDates( this.data );
            }
          }
          // if we have data locally, just use that
          if ( this.data ) {
            this.onFetchFinally();
            resolve( this.data );
            return;
          }
        }

        // the loading popup might not have been triggered. We need it now.
        if ( showLoading ) {
          await this.miscService.showLoadingPopup();
        }
        // get the idToken before a request to the proxy
        // tslint:disable-next-line
        var token = await this.firebaseUser.getIdToken();

      } catch ( e ) {
        this.onFetchError( e );
        this.onFetchFinally();
        reject( e );
        return;
      }

      // parse bitmask flags to determine what to append to the URL
      let parts = [];
      if ( dataRequestFlags & UserDataRequestFlags.BASIC_USER_DATA )        parts.push( 'basic' );
      if ( dataRequestFlags & UserDataRequestFlags.UNFINISHED_ACTIVITIES )  parts.push( 'unfinishedActivities' );
      let url = 'getUserData?parts=' + parts.join( ',' );
      this.proxyAPI.post( url, {firebaseIdToken: token}, showLoading )
      .then( async response => {
        await this.onFetchSuccess( response );
        resolve( this.data );
      })
      .catch( e => {
        this.onFetchError( e );
        reject( e );
      })
      .finally( () => this.onFetchFinally() );
    });

    return this.fetchingPromise;
  }

  private async onFetchSuccess( response ) {
    // save the data. For each key in each response, overwrite the existing key in the saved data.
    if ( !this.data ) {
      this.data = {};
    }
    // notificationPreferences given by the proxy include an object whose keys are FCM tokens, and the
    // values are preferences. Select only the preferences for the appropriate FCM token.
    const prefs = response.notificationPreferences;
    const fcmToken = await this.firebase.getToken();
    if ( prefs && typeof prefs === 'object' && typeof prefs[fcmToken] === 'object' ) {
      response.notificationPreferences = response.notificationPreferences[fcmToken];
    } else {
      // If this device's FCM token isn't in the list, create some defaults and send to the proxy.
      response.notificationPreferences = {
        language: this.settings.language,
        preEventSurveyReminderEnabled: true,
        reportReminderEnabled: true,
        upcomingEventsReminderEnabled: true
      } as IUserData['notificationPreferences'];
      this.updateNotificationPreferences( response.notificationPreferences, false );
    }
    Object.keys( response ).filter( key => response.hasOwnProperty(key) ).forEach( key => {
      this.data[key] = response[key];
    });
    // sort outreach locations and events by ascending date
    if ( this.data.outreachLocations ) {
      this.data.outreachLocations = this.data.outreachLocations.sort( (a, b) => a.date.getTime() - b.date.getTime() );
    }
    if ( this.data.events ) {
      this.data.events = this.data.events.sort( (a, b) => a.date.getTime() - b.date.getTime() );
    }
    // save the data in local cache
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
      this.miscService.showErrorPopup( e.status === 0 ? 'misc.messages.dataLoadErrorNetwork' : 'misc.messages.dataLoadErrorUnknown' );
    }
  }

  private onFetchFinally() {
    this.miscService.hideLoadingPopup();
    this.fetchingUserData = false;
  }

  public needsToVerifyEmail() {
    if ( !environment.emailVerificationRequired || !this.firebaseUser ) {
      return false;
    }
    // Users who authenticated via a third party don't need to verify their email; they've already verified their email with the 3rd party.
    const userHasLoggedInViaThirdParty = this.firebaseUser.providerData.some( provider => provider.providerId !== 'password' );
    return !userHasLoggedInViaThirdParty && !this.firebaseUser.emailVerified;
  }

  public mustWatchTrainingVideo(): boolean {
    // the user must watch the training video if he has not yet, or if he last watched it over a year ago
    const oneYearMs = new Date('2002-01-01').getTime() - new Date('2001-01-01').getTime();
    return !this.data.hasWatchedTrainingVideo || !this.data.trainingVideoLastWatchedDate || ( new Date().getTime() - this.data.trainingVideoLastWatchedDate.getTime() > oneYearMs );
  }

  /**
   * Takes an object that has any of the properties of the `notificationPreferences` property of IUserData,
   * and saves it to salesforce, associating the preferences with this device's FCM token
   */
  public async updateNotificationPreferences( preferences: IUserData['notificationPreferences'], showLoadingPopup: boolean ) {
    // merge some tokens with the preferences data
    const postData = Object.assign({
      firebaseIdToken: await this.firebaseUser.getIdToken(),
      fcmToken: await this.firebase.getToken()
    }, preferences );
    return this.proxyApiService.post( 'updateNotificationPreferences', postData, showLoadingPopup );
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
//       volunteerType: VolunteerType.volunteerDistributor,
//       hasWatchedTrainingVideo: false
//     };

//     this.fetchingUserData = false;
//   }

// }
