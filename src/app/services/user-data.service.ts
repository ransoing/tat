import { Injectable } from '@angular/core';

/**
 * This service doesn't communicate directly with Salesforce (SF), but communicates with a
 * proxy which communicates with Salesforce. The reason for this is that access to Salesforce
 * data requires a Salesforce username/password combo, and we don't want to make a SF user
 * account for every TAT volunteer, nor do we want every volunteer to use a shared account,
 * because then the client HTTP requests could be analyzed and modified to scrape data on all
 * TAT volunteers from the SF database.
 * 
 * Instead, only the proxy has the SF username/password, and has access to all SF data.
 * The user authenticates with Google/Apple inside the app, and the user's email and auth token
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
export class MockUserDataService {

  data: IUserData;

  constructor() { }

  async login( email: string, authToken: string ) {

  }

  // get latest user data from the server.
  async fetchUserData() {
    
  }
}


// ******************* mock service ******************* //

@Injectable({
  providedIn: 'root',
})
export class UserDataService {

  data: IUserData = {
    volunteerType: VolunteerType.truckStopVolunteer,
    hasWatchedTrainingVideo: true,
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
      { title: 'Some other truck stop', }
    ]
  };

  constructor() { }

  async login( email: string, authToken: string ) {

  }

  // get latest user data from the server.
  async fetchUserData() {

  }

}
