import { Component } from '@angular/core';
import { MiscService, DynamicURLsService } from '../../services';

@Component({
  selector: 'app-case-study-b',
  templateUrl: './case-study-b.component.html',
  styleUrls: ['./case-study-b.component.scss']
})
export class CaseStudyBComponent {

  public showVideo: boolean = false;
  public showFullStory: boolean = false;
  public modal: HTMLIonModalElement;

  public videoUrl: string;
  
  constructor(
    public miscService: MiscService,
    public dynamicUrls: DynamicURLsService
  ) {
    this.dynamicUrls.getVideoResourceUrls().then( videoUrls => {
      this.videoUrl = videoUrls['be-a-changemaker'];
    });
  }
}
