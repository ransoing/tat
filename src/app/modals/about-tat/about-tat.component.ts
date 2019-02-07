import { Component } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  templateUrl: './about-tat.component.html'
})
export class AboutTatComponent {

  public modal: HTMLIonModalElement;
  public lastYear = ( new Date().getFullYear() ) - 1;
  
  constructor( public miscService: MiscService ) { }

}
