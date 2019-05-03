import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MiscService } from './misc.service';

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
*/


// ******************* the service ******************* //
@Injectable({
  providedIn: 'root',
})
export class ProxyAPIService {

  constructor(
    private http: HttpClient,
    private miscService: MiscService
  ) {}

  /**
   * Takes a part of the API url, like 'contactSearch'. Makes a GET request and returns a promise.
   * Automatically shows and hides a loading popup.
   */
  public async get( urlSegment: string ) {
    await this.miscService.showLoadingPopup();
    return this.http.get( environment.proxyServerURL + urlSegment ).toPromise()
    .then( response => this.onSuccess(response) )
    .finally( () => this.miscService.hideLoadingPopup() );
  }

  /**
   * Takes a part of the API url, like 'getBasicUserData`.
   * Makes a POST request to the API and returns a promise.
   * Automatically shows and hides a loading popup.
   */
  public async post( urlSegment: string, payload: any ) {
    await this.miscService.showLoadingPopup();
    return this.http.post(
      environment.proxyServerURL + urlSegment,
      payload,
      { headers: new HttpHeaders({'Content-Type': 'application/json'}) }
    ).toPromise()
    .then( response => this.onSuccess(response) )
    .finally( () => this.miscService.hideLoadingPopup() );
  }

  /**
   * Detects special error cases and converts Date strings into Date objects
   */
  private onSuccess( response ) {
    // in some cases, the response can be 200 but completely blank (perhaps some uncaught error in the proxy?)
    if ( typeof response !== 'object' || response === null ) {
      throw new Error( 'Response is not an object: ' + JSON.stringify(response) );
    }
    // convert ISO time strings to Date objects
    return this.convertJSONDates( response );
  }
  

  /**
   * Takes an object and recursively looks for ISO-8601 date strings or YYYY-MM-DD strings, and converts
   * them to Date objects. Modifies the original object.
   */
  private convertJSONDates( object: any ): any {
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
    });
    return object;
  }

}
