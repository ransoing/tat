import { Component } from '@angular/core';
import { MiscService, UserDataService, DynamicURLsService } from '../../services';
import { VolunteerType } from '../../models/user-data';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoType } from '../../models/video';

@Component({
  selector: 'app-volunteer-resources',
  templateUrl: './volunteer-resources.component.html',
  styleUrls: ['./volunteer-resources.component.scss']
})
export class VolunteerResourcesComponent {

  public modal: HTMLIonModalElement;
  public video: any;
  public VolunteerType = VolunteerType;
  public VideoType = VideoType;

  constructor(
    public miscService: MiscService,
    public userData: UserDataService,
    public dynamicUrls: DynamicURLsService,
    public domSanitizer: DomSanitizer
  ) {
    this.dynamicUrls.getURLs().then( urls => {
      this.video = miscService.getEmbeddableVideo( urls.videos.resources['tat-training'] );
      this.video.url = this.domSanitizer.bypassSecurityTrustResourceUrl( this.video.url );
    });
  }

}
