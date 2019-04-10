
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
  hasWatchedTrainingVideo1?: boolean,
  hasWatchedTrainingVideos?: boolean, // this property and the one above are the only properties which aren't retrieved by salesforce. 
  hasCompletedTrainingFeedback?: boolean,
  address?: string,
  city?: string,
  state?: string,
  zip?: string,
  hoursLogs?: IHoursLog[],
  unfinishedOutreachTargets?: IUnfinishedOutreachTarget[],
  unfinishedEvents?: any // @@ fill this out
}
