import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ScriptService, MiscService, DynamicURLsService } from '../../services';
import { VideoType } from '../../models/video';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@Component({
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss']
})
export class TrainingVideoComponent implements OnInit {

  @ViewChild( VideoPlayerComponent, { static: false } ) videoPlayer: VideoPlayerComponent;
  // one of the keys in the firebase dynamic urls, under urls->videos->volunteer-training
  @Input ('videoUrlKey') videoUrlKey: string;
  @Input ('onFinishedWatching') onFinishedWatching: Function;

  public modal: HTMLIonModalElement;
  public error: boolean = false;
  public videoUrl: string;

  constructor(
    public scriptService: ScriptService,
    public miscService: MiscService,
    public dynamicUrls: DynamicURLsService
  ) {}

  ngOnInit() {
    this.dynamicUrls.getURLs().then( urls => {
      this.videoUrl = urls.videos['volunteer-training'][this.videoUrlKey];
    });
  }

  // this function runs when the video's iframe loads
  onVideoFrameLoaded = () => {
    if ( this.videoPlayer ) {
      if ( this.videoPlayer.type === VideoType.VIMEO ) {
        // load the vimeo controller script
        let frame = this.videoPlayer.iframe.nativeElement;
        this.scriptService.load( 'vimeo-player' ).then( data => {
          // watch for when the user finishes the video
          let player = new window['Vimeo'].Player( frame );
          player.on( 'ended', () => this.onUserFinishedWatching() );
        }).catch( error => {
          this.error = true;
        });

      } else if ( this.videoPlayer.type === VideoType.YOUTUBE ) {
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
        console.error( 'Unknown video type: ' + this.videoPlayer.type );
      }
    }
  }

  onUserFinishedWatching() {
    this.onFinishedWatching();
    this.modal.dismiss();
  }

}
