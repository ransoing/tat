import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService, OutreachLocationType } from '../../../services';

@Component({
  templateUrl: 'por-part-2.page.html'
})
export class PORPart2Page {

  private OutreachLocationType = OutreachLocationType;
  private locationType = OutreachLocationType.TruckStop;

  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.postOutreachForm === undefined ) {
      formsService.resetPostOutreachForm();
    }
  }
}
