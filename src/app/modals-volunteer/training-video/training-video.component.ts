import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScriptService, MiscService, DynamicURLsService } from '../../services';
import { VideoType } from '../../models/video';

@Component({
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss']
})
export class TrainingVideoComponent implements OnInit {

  // one of the keys in the firebase dynamic urls, under urls->videos->volunteer-training
  @Input ('videoUrlKey') videoUrlKey: string;
  @Input ('onFinishedWatching') onFinishedWatching: Function;

  public modal: HTMLIonModalElement;
  public error: boolean = false;
  public videoUrl: SafeResourceUrl;
  public videoType: VideoType;

  constructor(
    public domSanitizer: DomSanitizer,
    public scriptService: ScriptService,
    public miscService: MiscService,
    public dynamicUrls: DynamicURLsService
  ) {}

  ngOnInit() {
    this.dynamicUrls.getURLs().then( urls => {
      let embeddableUrl = this.miscService.getEmbeddableVideo( urls.videos['volunteer-training'][this.videoUrlKey] );
      this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl( embeddableUrl.url );
      this.videoType = embeddableUrl.type;
    });
  }

  // this function runs when the video's iframe loads
  onVideoFrameLoaded() {
    if ( this.videoType === VideoType.VIMEO ) {
      // load the vimeo controller script
      let frame = document.querySelector( '#video-iframe' );
      this.scriptService.load( 'vimeo-player' ).then( data => {
        // watch for when the user finishes the video
        let player = new window['Vimeo'].Player( frame );
        player.on( 'ended', () => this.onUserFinishedWatching() );
      }).catch( error => {
        this.error = true;
      });

    } else if ( this.videoType === VideoType.YOUTUBE ) {
      let onYoutubeAPIReady = () => {
        let player = new window['YT'].Player( 'video-iframe', {
          events: {
            onStateChange: ( evt ) => {
              // watch for when the user finishes the video. data === 0 means 'ended'
              if ( evt.data === 0 ) this.onUserFinishedWatching();
            }
          }
        });
      };
      
      if ( window['YT'] ) {
        onYoutubeAPIReady();
      } else {
        window['onYouTubeIframeAPIReady'] = () => onYoutubeAPIReady();
        this.scriptService.load( 'youtube-api' ).then( data => {} );
      } 

    } else {
      console.error( 'Unknown video type: ' + this.videoType );
    }
  }

  onUserFinishedWatching() {
    this.onFinishedWatching();
    this.modal.dismiss();
  }

}
