import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService } from '../../../services';

@Component({
  selector: 'app-pos-part-1',
  templateUrl: 'pos-part-1.page.html',
  styleUrls: ['pos-part-1.page.scss']
})
export class POSPart1Page {
  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) {
    if ( formsService.preOutreachForm === false ) {
      formsService.resetPreOutreachForm();
    }
  }
}
