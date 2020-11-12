import { IUserData, IAmbassadorEvent } from './user-data';
import { User } from 'firebase';
import { ISurvey } from './survey';
import { IOutreachLocation } from './user-data';

// define partial interfaces so we can have code hinting in external packages/modules, without including
// those services in the exported package/module

export interface IMiscService {
  dateToLocalYYYYMMDD( date: Date | string ): string;
  showErrorPopup( translationKey?: string ): Promise<any>;
}

export interface IProxyAPIService {
  get( urlSegment: string ): Promise<any>;
  post( urlSegment: string, payload: any ): Promise<any>;
}

export interface IUserDataService {
  firebaseUser: User;
  data: IUserData;
}

export interface ITrxService {
  t( key: string, params?: any ): Promise<string>;
}

export interface ISurveyService {
    preOutreachSurvey( numLocations: number ): Promise<ISurvey>;
    postOutreachSurvey( location: IOutreachLocation ): Promise<ISurvey>;
    // preEventSurvey
    postEventSurvey( event: IAmbassadorEvent ): Promise<ISurvey>;
    testimonialFeedbackSurvey( campaignId?: string ): Promise<ISurvey>;
    signupSurvey(): Promise<ISurvey>;
    editAccountSurvey(): Promise<ISurvey>;
}
