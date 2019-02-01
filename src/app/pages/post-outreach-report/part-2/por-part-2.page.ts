import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService, OldOutreachLocationType } from '../../../services';

@Component({
  templateUrl: 'por-part-2.page.html'
})
export class PORPart2Page {

  public OldOutreachLocationType = OldOutreachLocationType;
  public locationType = OldOutreachLocationType.TruckStop;

  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.postOutreachForm === undefined ) {
      formsService.resetPostOutreachForm();
    }
  }
}
