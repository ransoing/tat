import { Component } from '@angular/core';
import { MiscService } from '../../services';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './about-tat.component.html'
})
export class AboutTatComponent {

  public modal: HTMLIonModalElement;
  public lastYear = ( new Date().getFullYear() ) - 1;
  environment = environment

  constructor( public miscService: MiscService ) { }

}
