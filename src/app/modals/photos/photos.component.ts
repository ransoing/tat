import { Component } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent {

  public modal: HTMLIonModalElement;
  
  constructor( private miscService: MiscService ) { }

}
