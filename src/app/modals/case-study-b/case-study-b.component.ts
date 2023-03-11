import { Component } from '@angular/core';
import { MiscService, DynamicURLsService } from '../../services';
import { environment } from '../../../environments/environment';
import { AppMode } from '../../models/app-mode';

@Component({
  selector: 'app-case-study-b',
  templateUrl: './case-study-b.component.html',
  styleUrls: ['./case-study-b.component.scss']
})
export class CaseStudyBComponent {

  public videoExpanded: boolean = false;
  public showFullStory: boolean = false;
  public modal: HTMLIonModalElement;

  public videoUrl: string;
  
  constructor(
    public miscService: MiscService,
    public dynamicUrls: DynamicURLsService
  ) {
    
    if ( environment.app === AppMode.TAT ) {
      this.dynamicUrls.getVideoResourceUrls().then( videoUrls => {
        this.videoUrl = videoUrls['be-a-changemaker'];
      });
    }
  }

  showVideo() {
    if ( environment.app === AppMode.TAT ) {
      this.videoExpanded = !this.videoExpanded;
    } else {
      this.miscService.openExternalLink( 'https://vimeo.com/338990454?embedded=true&source=video_title&owner=63594831' );
    }
  }
}
