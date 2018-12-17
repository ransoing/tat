import { Component } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-human-trafficking-laws',
  templateUrl: './human-trafficking-laws.component.html',
  styleUrls: ['./human-trafficking-laws.component.scss']
})
export class HumanTraffickingLawsComponent {

  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }

}
