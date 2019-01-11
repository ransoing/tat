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
  truckStopVolunteer = 'truckStopVolunteer',
  eventVolunteer = 'freedomDriversVolunteer',
  ambassadorVolunteer = 'ambassadorVolunteer'
}

export interface IHoursLog {
  taskDescription: string,
  date: Date,
  numHours: number
}

// If the user filled out a pre-outreach or pre-event survey, there will be an "incomplete post-report"
// until they submit the post-report
export interface IIncompletePostReport {
  title: string, // name of the event or location
  date?: Date // if it's an event, this is the date of the event. This is used to show a reminder notification to fill out the post-report.
}

export interface IUserData {
  volunteerType: VolunteerType,
  hasWatchedTrainingVideo: boolean,
  hoursLogs: IHoursLog[],
  incompletePostReports: IIncompletePostReport[]
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

  data: IUserData;
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
   */
  async fetchUserData( force?: boolean ) {
    // quit now if we've already gotten the data and the caller of this function isn't forcing a refresh,
    // and we're not currently fetching the data already
    if ( (this.data && !force) || this.fetchingUserData ) {
      return;
    }

    this.fetchingUserData = true;
    // invalidate the current data until we get new data
    this.data = null;
    
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
    }

    // make the request to the proxy
    let subscriber = this.http.post(
      environment.proxyServerURL + '/getUserData',
      { firebaseIdToken: token },
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    ).subscribe( response => {
      this.onFetchSuccess( response );
      subscriber.unsubscribe();
    }, e => {
      this.onFetchError( e );
      subscriber.unsubscribe();
    });

  }

  private onFetchSuccess( response ) {
    // convert ISO time strings to Date objects
    this.convertJSONDates( response );
    // save the data.
    this.data = response;
    // done loading the data.
    this.onFetchFinally();
  }

  private async onFetchError( e ) {
    console.error( e );
    const alert = await this.alertController.create({
      header: await this.trx.t( 'misc.error' ),
      message: await this.trx.t( 'misc.dataLoadError' ),
      buttons: [await this.trx.t( 'misc.close' )]
    });
    alert.present();
    this.onFetchFinally();
  }

  private onFetchFinally() {
    this.loadingPopup.dismiss();
    this.fetchingUserData = false;
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
      // if the string looks like ISO-8601 date, convert it to a Date object
      } else if ( typeof val === 'string' && val.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/) ) {
        object[key] = new Date( val );
      }
    })
  }

}


// ******************* mock service ******************* //

@Injectable({
  providedIn: 'root',
})
export class MockUserDataService {

  data: IUserData;
  fetchingUserData: Boolean;

  constructor() {}

  async fetchUserData( force?: boolean ) {
    // quit now if we've already gotten the data and the caller of this function isn't forcing a refresh,
    // and we're not currently fetching the data already
    if ( (this.data && !force) || this.fetchingUserData ) {
      return;
    }

    this.fetchingUserData = true;
    // invalidate the current data until we get new data
    this.data = null;
    this.onFetchSuccess();
  }

  onFetchSuccess() {
    // return some fake data.
    this.data = {
      volunteerType: VolunteerType.truckStopVolunteer,
      hasWatchedTrainingVideo: false,
      hoursLogs: [
        {
          taskDescription: 'Handed out TAT flyers to every truck stop in Nebraska',
          date: new Date('11/29/2018'),
          numHours: 14
        }, {
          taskDescription: 'Convinced the manager at Love\'s to train 1000 employees.',
          date: new Date('11/15/2018'),
          numHours: 3
        }
      ],
      incompletePostReports: [
        { title: 'Some truck stop' },
        { title: 'Some other truck stop' }
      ]
    };

    this.fetchingUserData = false;
  }

}
