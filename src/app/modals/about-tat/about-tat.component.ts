import { Component } from '@angular/core';
import { MiscService } from '../../services';
import pack from '../../,./../../../package.json';

@Component({
  templateUrl: './about-tat.component.html'
})
export class AboutTatComponent {

  public modal: HTMLIonModalElement;
  public lastYear = ( new Date().getFullYear() ) - 1;
  public version = pack.version;
  
  constructor( public miscService: MiscService ) { }

}
