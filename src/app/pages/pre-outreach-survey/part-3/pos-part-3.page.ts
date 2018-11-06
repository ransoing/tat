import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService } from '../../../services';

@Component({
  templateUrl: 'pos-part-3.page.html'
})
export class POSPart3Page {
  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.preOutreachForm === undefined ) {
      formsService.resetPreOutreachForm();
    }
  }
}
