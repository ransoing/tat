import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormsService {

  constructor() { }

  preOutreachForm: any = false;

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
      locationType: '',
      locationName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

}