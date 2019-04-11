import { Component } from '@angular/core';
import { MiscService, DynamicURLsService } from '../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-case-study-b',
  templateUrl: './case-study-b.component.html',
  styleUrls: ['./case-study-b.component.scss']
})
export class CaseStudyBComponent {

  public showVideo: boolean = false;
  public showFullStory: boolean = false;
  public modal: HTMLIonModalElement;

  public videoUrl: SafeResourceUrl;
  
  constructor(
    public miscService: MiscService,
    public dynamicUrls: DynamicURLsService,
    public domSanitizer: DomSanitizer
  ) {
    this.dynamicUrls.getURLs().then( urls => {
      this.videoUrl = domSanitizer.bypassSecurityTrustResourceUrl( miscService.getEmbeddableVideo(urls.videos.resources['be-a-changemaker']).url );
    });
  }
}
