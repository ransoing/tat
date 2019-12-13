import { IUserSettings } from "../services";

export enum VolunteerType {
  VOLUNTEER_DISTRIBUTOR = 'volunteerDistributor',
  AMBASSADOR_VOLUNTEER = 'ambassadorVolunteer'
}

export enum OutreachLocationType {
  CDL_SCHOOL = 'cdlSchool',
  TRUCKING_COMPANY = 'truckingCompany',
  TRUCK_STOP = 'truckStop'
}

// bitmask flags for passing into fetchUserData()
export enum UserDataRequestFlags {
  BASIC_USER_DATA = 1,        // 2^0
  UNFINISHED_ACTIVITIES = 2,  // 2^1
  ALL = 3                     // 2^0 + 2^1
}

export interface IPostActivityReport {
  followUpDate: Date | null;
}

// If the user filled out a pre-outreach or pre-event survey, there will be an "incomplete post-report"
// until they submit the post-report
export interface IOutreachLocation {
  id: string; // ID of the object in salesforce
  name: string; // name of the location to be volunteered at
  type: OutreachLocationType;
  campaignId: string; // ID of the related campaign in salesforce
  street?: string; // street address of location
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  date?: Date; // the planned date of outreach
  contact?: { // the person to be contacted at the location
    firstName: string,
    lastName: string,
    title?: string,
    email?: string,
    phone?: string
  };
}

export interface IUserData {
  salesforceId?: string; // ID of the Contact object in salesforce which represents this user
  firstName?: string;
  lastName?: string;
  volunteerType?: VolunteerType;
  accountId?: string; // salesforce ID of the Account object associated with this user
  hasWatchedTrainingVideo?: boolean; // this property is the only one which isn't retrieved by salesforce.
  trainingVideoLastWatchedDate?: Date;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;

  // the next few apply to Distributor Volunteers only
  isOnVolunteerTeam?: boolean;
  isTeamCoordinator?: boolean;
  teamCoordinatorId?: string;
  trainingVideoRequiredForTeam?: boolean;

  outreachLocations?: IOutreachLocation[];
  events?: any[]; // @@TODO define events object

  notificationPreferences?: {
    language?: IUserSettings['language'];
    // reminds user to fill out the pre-event survey, before an event (doesn't apply to Truck Stop volunteers)
    preEventSurveyReminderEnabled?: boolean;
    // reminds user to fill out either post-outreach reports or post-event reports (depends on the volunteer type)
    reportReminderEnabled?: boolean;
    // reminds user about upcoming TAT outreach events (doesn't apply to Truck Stop volunteers)
    upcomingEventsReminderEnabled?: boolean;
  };
}
