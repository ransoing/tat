import { Component } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  templateUrl: './about-tat.component.html'
})
export class AboutTatComponent {

  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }

}
