import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService } from '../../../services';

@Component({
  templateUrl: 'por-part-2.page.html'
})
export class PORPart2Page {

  private locationType = 'truckStop'; // 'truckStop' 'cdl' 'truckingCompany'

  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.postOutreachForm === false ) {
      formsService.resetPostOutreachForm();
    }
  }
}
