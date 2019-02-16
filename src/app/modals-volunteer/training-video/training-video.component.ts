import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VolunteerType, UserDataService, ScriptService } from '../../services';

@Component({
  templateUrl: './training-video.component.html',
  styleUrls: ['./training-video.component.scss']
})
export class TrainingVideoComponent implements OnInit {

  public modal: HTMLIonModalElement;
  
  public videos;
  public video;
  public error: boolean = false;
  public videoUrl;

  constructor(
    public domSanitizer: DomSanitizer,
    public userDataService: UserDataService,
    public scriptService: ScriptService
  ) {
    
    this.videos = {};
    // @@TODO: need different videos for different volunteer types
    this.videos[ VolunteerType.TRUCK_STOP_VOLUNTEER ] = {
      type: 'vimeo',
      id: '21392891'
    };
    this.videos[ VolunteerType.EVENT_VOLUNTEER ] = {
      type: 'vimeo',
      id: '21392891'
    };
    this.videos[ VolunteerType.AMBASSADOR_VOLUNTEER ] = {
      type: 'vimeo',
      id: '21392891'
    };

    // which video to show?
    this.video = this.videos[ userDataService.data.volunteerType ];
  }

  ngOnInit() {
    let url = this.video.type === 'vimeo' ? 
      'https://player.vimeo.com/video/' + this.video.id + '?title=0&portrait=0' :
      'https://www.youtube.com/embed/' + this.video.id + '?rel=0';
    
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

    } else {
      // @@TODO if there are training videos on youtube
    }
  }

  onUserFinishedWatching() {
    this.userDataService.data.hasWatchedTrainingVideo = true;
    this.userDataService.updateCache();
    this.modal.dismiss();
  }

}
