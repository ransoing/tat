import { Component } from '@angular/core';
import { MiscService } from '../../services';

@Component({
  selector: 'app-case-study-b',
  templateUrl: './case-study-b.component.html',
  styleUrls: ['./case-study-b.component.scss']
})
export class CaseStudyBComponent {

  public showVideo: boolean = false;
  public showFullStory: boolean = false;
  public modal: HTMLIonModalElement;
  
  constructor( public miscService: MiscService ) { }
}
