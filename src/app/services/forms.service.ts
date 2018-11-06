import { Injectable } from '@angular/core';

export enum OutreachLocationType {
  CDLSchool = 'cdlSchool',
  TruckingCompany = 'truckingCompany',
  TruckStop = 'truckStop'
}

export interface IPreOutreachForm {
  locations: {
    locationType: OutreachLocationType,
    locationName: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    zip: string
  }[],
  feelEquipped: 'yes' | 'no',
  feelEquippedQuestions: string,
  contactedManager: 'yes' | 'no',
  readyToReceive: 'yes' | 'no',
  strategy: string,
  materialsAddress: {
    name: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    zip: string
  }
}

export interface IPostOutreachForm {
  meetingDescription: string,
  accomplishments: {
    truckStop: {
      willDistribute: boolean,
      willTrainWithMaterials: boolean,
      wantsInPersonTraining: boolean,
      wantsOutreach: boolean
    },
    cdl: {
      willTrain: boolean,
      willPassOnInfo: boolean
    },
    truckingCompany: {
      willTrain: boolean
    }
  },
  willFollowUp: 'yes' | 'no',
  followUp: {
    date: any,
    strategy: string
  }
}

export interface IHoursLogForm {
  description: string,
  date: any,
  hours: number
}


@Injectable({
  providedIn: 'root',
})
export class FormsService {

  constructor() { }

  preOutreachForm: IPreOutreachForm;
  postOutreachForm: IPostOutreachForm;
  hoursForm: IHoursLogForm;

  public resetPreOutreachForm() {
    this.preOutreachForm = {
      locations: [],
      feelEquipped: undefined,
      feelEquippedQuestions: '',
      contactedManager: undefined,
      readyToReceive: undefined,
      strategy: '',
      materialsAddress: {
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: ''
      }
    };

    this.addPreOutreachFormLocation();
  }

  public addPreOutreachFormLocation() {
    this.preOutreachForm.locations.push({
      locationType: undefined,
      locationName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  public resetPostOutreachForm() {
    this.postOutreachForm = {
      meetingDescription: '',
      accomplishments: {
        truckStop: {
          willDistribute: false,
          willTrainWithMaterials: false,
          wantsInPersonTraining: false,
          wantsOutreach: false
        },
        cdl: {
          willTrain: false,
          willPassOnInfo: false
        },
        truckingCompany: {
          willTrain: false
        }
      },
      willFollowUp: undefined,
      followUp: {
        date: undefined,
        strategy: ''
      }
    };
  }

  public resetHoursForm() {
    this.hoursForm = {
      description: '',
      date: undefined,
      hours: undefined
    };
  }
}