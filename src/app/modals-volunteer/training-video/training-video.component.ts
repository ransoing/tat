import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VolunteerType, UserDataService, ScriptService } from '../../services';

@Component({
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss']
})
export class TrainingVideoComponent implements OnInit {

  static readonly videos = {
    [ VolunteerType.TRUCK_STOP_VOLUNTEER ]: [
      {
        type: 'vimeo',
        id: '265816556'
      }, {
        type: 'vimeo',
        id: '21392891'
      }
    ],
    [ VolunteerType.EVENT_VOLUNTEER ]: {
      type: 'youtube',
      id: 'SxmfgDT5f4c'
    },
    [ VolunteerType.AMBASSADOR_VOLUNTEER ]: {
      type: 'vimeo',
      id: '221037855'
    }
  };

  @Input ('video') video; // an object from the `videos` static property
  @Input ('onFinishedWatching') onFinishedWatching: Function;

  public modal: HTMLIonModalElement;
  
  public videos;
  public error: boolean = false;
  public videoUrl;

  constructor(
    public domSanitizer: DomSanitizer,
    public userDataService: UserDataService,
    public scriptService: ScriptService
  ) {}

  ngOnInit() {
    let url = this.video.type === 'vimeo' ? 
      'https://player.vimeo.com/video/' + this.video.id + '?title=0&portrait=0' :
      'https://www.youtube.com/embed/' + this.video.id + '?rel=0&enablejsapi=1';
    
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl( url );
  }

  onVideoFrameLoaded() {
    if ( this.video.type === 'vimeo' ) {
      // load the vimeo controller script
      let frame = document.querySelector( '#video-iframe' );
      this.scriptService.load( 'vimeo-player' ).then( data => {
        // watch for when the user finishes the video
        let player = new window['Vimeo'].Player( frame );
        player.on( 'ended', () => this.onUserFinishedWatching() );
      }).catch( error => {
        this.error = true;
      });

    } else if ( this.video.type === 'youtube' ) {
      let frame = document.querySelector( '#video-iframe' );
      window['onYouTubeIframeAPIReady'] = () => {
        let player = new window['YT'].Player( 'video-iframe', {
          events: {
            onStateChange: ( evt ) => {
              // watch for when the user finishes the video. data === 0 means 'ended'
              if ( evt.data === 0 ) this.onUserFinishedWatching();
            }
          }
        });
      };
      this.scriptService.load( 'youtube-api' ).then( data => {} );

    } else {
      console.error( 'Unknown video type: ' + this.video.type );
    }
  }

  onUserFinishedWatching() {
    this.onFinishedWatching();
    this.modal.dismiss();
  }

}
