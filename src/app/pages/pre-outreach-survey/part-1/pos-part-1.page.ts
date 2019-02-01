import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService, OldOutreachLocationType } from '../../../services';

@Component({
  templateUrl: 'pos-part-1.page.html'
})
export class POSPart1Page {

  OldOutreachLocationType = OldOutreachLocationType;

  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.preOutreachForm === undefined ) {
      formsService.resetPreOutreachForm();
    }
  }
}
