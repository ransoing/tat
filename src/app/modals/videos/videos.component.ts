import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicURLsService, MiscService } from '../../services';
import { VideoType } from '../../models/video';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  public modal: HTMLIonModalElement;
  public VideoType = VideoType;
  
  public videos: {
    title: string,
    desc: string,
    type: VideoType,
    url: SafeResourceUrl
  }[] = [];

  constructor(
    public domSanitizer: DomSanitizer,
    public dynamicUrls: DynamicURLsService,
    public miscService: MiscService
  ) {
    this.dynamicUrls.getURLs().then( urls => {
      let resourceVideos = urls.videos.resources;

      let video = miscService.getEmbeddableVideo( resourceVideos['tat-training'] );
      this.videos.push({
        title: 'resources.videos.video1.title',
        desc: 'resources.videos.video1.description',
        type: video.type,
        url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
      });

      video = miscService.getEmbeddableVideo( resourceVideos['be-a-changemaker'] );
      this.videos.push({
        title: 'resources.videos.video2.title',
        desc: 'resources.videos.video2.description',
        type: video.type,
        url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
      });

      video = miscService.getEmbeddableVideo( resourceVideos['law-enforcement-training'] );
      this.videos.push({
        title: 'resources.videos.video3.title',
        desc: 'resources.videos.video3.description',
        type: video.type,
        url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
      });

      video = miscService.getEmbeddableVideo( resourceVideos['wallet-card-webinar'] );
      this.videos.push({
        title: 'resources.videos.video4.title',
        desc: 'resources.videos.video4.description',
        type: video.type,
        url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
      });
    });
  }

  ngOnInit() {
  }

}
