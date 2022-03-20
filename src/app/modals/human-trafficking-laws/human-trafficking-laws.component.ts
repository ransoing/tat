import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppMode } from '../../models/app-mode';
import { MiscService } from '../../services';

@Component({
  selector: 'app-human-trafficking-laws',
  templateUrl: './human-trafficking-laws.component.html',
  styleUrls: ['./human-trafficking-laws.component.scss']
})
export class HumanTraffickingLawsComponent {

  public modal: HTMLIonModalElement;
  environment = environment;
  AppMode = AppMode;
  
  constructor( public miscService: MiscService ) { }

}
