import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicURLsService, MiscService } from '../../services';

interface IPodcastApp {
  trxKey: string;
  icon: string;
}

interface IPodcast {
  titleTrxKey: string;
  descTrxKey: string;
  coverArt: string;
  hosts: {
    app: IPodcastApp,
    url: string
  }[];
}

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss']
})
export class PodcastsComponent implements OnInit {

  public modal: HTMLIonModalElement;

  public apps: { [key: string]: IPodcastApp } = {
    addict: {
      trxKey: 'resources.podcasts.apps.addict',
      icon: './assets/images/podcasts/app-icons/podcast-addict.png'
    },
    apple: {
      trxKey: 'resources.podcasts.apps.apple',
      icon: './assets/images/podcasts/app-icons/apple-music.png'
    },
    deezer: {
      trxKey: 'resources.podcasts.apps.deezer',
      icon: './assets/images/podcasts/app-icons/deezer.png'
    },
    listenNotes: {
      trxKey: 'resources.podcasts.apps.listenNotes',
      icon: './assets/images/podcasts/app-icons/listen-notes.png'
    },
    playerFm: {
      trxKey: 'resources.podcasts.apps.playerFm',
      icon: './assets/images/podcasts/app-icons/player-fm.png'
    },
    podchaser: {
      trxKey: 'resources.podcasts.apps.podchaser',
      icon: './assets/images/podcasts/app-icons/podchaser.png'
    },
    spotify: {
      trxKey: 'resources.podcasts.apps.spotify',
      icon: './assets/images/podcasts/app-icons/spotify.png'
    }
  };

  public podcasts: IPodcast[] = [
    {
      titleTrxKey: 'resources.podcasts.drivingFreedom.title',
      descTrxKey: 'resources.podcasts.drivingFreedom.description',
      coverArt: './assets/images/podcasts/driving-freedom.jpg',
      hosts: [
        {
          app: this.apps.spotify,
          url: 'https://open.spotify.com/show/3hSQoCJyZiWNcvidR7B2AL'
        }, {
          app: this.apps.apple,
          url: 'https://podcasts.apple.com/us/podcast/driving-freedom-podcast/id1535337263'
        }, {
          app: this.apps.addict,
          url: 'https://podcastaddict.com/podcast/3120822'
        }, {
          app: this.apps.podchaser,
          url: 'https://www.podchaser.com/podcasts/driving-freedom-podcast-1474892/episodes'
        }, {
          app: this.apps.deezer,
          url: 'https://www.deezer.com/us/show/1807512'
        }, {
          app: this.apps.listenNotes,
          url: 'https://www.listennotes.com/podcasts/driving-freedom-podcast-truckers-against-ygtrpJn6_MX/'
        }, {
          app: this.apps.playerFm,
          url: 'https://player.fm/series/driving-freedom-podcast'
        }
      ]
    }
  ];


  constructor(
    public domSanitizer: DomSanitizer,
    public dynamicUrls: DynamicURLsService,
    public miscService: MiscService
  ) {
    
    // this.dynamicUrls.getURLs().then( urls => {
    //   let resourceVideos = urls.videos.resources;

    //   let video = miscService.getEmbeddableVideo( resourceVideos['tat-training'] );
    //   this.videos.push({
    //     title: 'resources.videos.video1.title',
    //     desc: 'resources.videos.video1.description',
    //     type: video.type,
    //     url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
    //   });

    //   video = miscService.getEmbeddableVideo( resourceVideos['be-a-changemaker'] );
    //   this.videos.push({
    //     title: 'resources.videos.video2.title',
    //     desc: 'resources.videos.video2.description',
    //     type: video.type,
    //     url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
    //   });

    //   video = miscService.getEmbeddableVideo( resourceVideos['law-enforcement-training'] );
    //   this.videos.push({
    //     title: 'resources.videos.video3.title',
    //     desc: 'resources.videos.video3.description',
    //     type: video.type,
    //     url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
    //   });

    //   video = miscService.getEmbeddableVideo( resourceVideos['wallet-card-webinar'] );
    //   this.videos.push({
    //     title: 'resources.videos.video4.title',
    //     desc: 'resources.videos.video4.description',
    //     type: video.type,
    //     url: this.domSanitizer.bypassSecurityTrustResourceUrl( video.url )
    //   });
    // });
  }

  ngOnInit() {
  }

}
