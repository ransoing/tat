import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormsService } from '../../../services';

@Component({
  selector: 'app-pos-part-2',
  templateUrl: 'pos-part-2.page.html',
  styleUrls: ['pos-part-2.page.scss']
})
export class POSPart2Page {
  constructor(
    public navCtrl: NavController,
    public formsService: FormsService
  ) { }
}
