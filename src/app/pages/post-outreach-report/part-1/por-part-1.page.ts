import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService } from '../../../services';

@Component({
  templateUrl: 'por-part-1.page.html'
})
export class PORPart1Page {
  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.postOutreachForm === undefined ) {
      formsService.resetPostOutreachForm();
    }
  }
}
