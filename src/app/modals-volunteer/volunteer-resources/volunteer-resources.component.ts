import { Component } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-volunteer-resources',
  templateUrl: './volunteer-resources.component.html',
  styleUrls: ['./volunteer-resources.component.scss']
})
export class VolunteerResourcesComponent {

  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }

}
