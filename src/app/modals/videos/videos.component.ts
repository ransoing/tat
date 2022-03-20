import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    url: string
  }[] = [];

  constructor(
    public domSanitizer: DomSanitizer,
    public dynamicUrls: DynamicURLsService,
    public miscService: MiscService
  ) {
    this.dynamicUrls.getVideoResourceUrls().then( resourceVideos => {
      this.videos.push({
        title: 'resources.videos.video1.title',
        desc: 'resources.videos.video1.description',
        url: resourceVideos['tat-training']
      });

      this.videos.push({
        title: 'resources.videos.video2.title',
        desc: 'resources.videos.video2.description',
        url: resourceVideos['be-a-changemaker']
      });

      this.videos.push({
        title: 'resources.videos.video3.title',
        desc: 'resources.videos.video3.description',
        url: resourceVideos['law-enforcement-training']
      });

      this.videos.push({
        title: 'resources.videos.video4.title',
        desc: 'resources.videos.video4.description',
        url: resourceVideos['wallet-card-webinar']
      });

      this.videos.push({
        title: 'resources.videos.video5.title',
        desc: 'resources.videos.video5.description',
        url: resourceVideos['addressing-demand']
      });
    });
  }

  ngOnInit() {
  }

}
