import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService, OutreachLocationType } from '../../../services';

@Component({
  templateUrl: 'pos-part-1.page.html'
})
export class POSPart1Page {

  OutreachLocationType = OutreachLocationType;

  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.preOutreachForm === undefined ) {
      formsService.resetPreOutreachForm();
    }
  }
}
