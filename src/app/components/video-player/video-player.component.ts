import { Component, OnChanges, OnDestroy, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppMode } from '../../models/app-mode';
import { VideoType } from '../../models/video';
import { MiscService } from '../../services';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnChanges, OnDestroy, OnInit {
  @ViewChild( 'iframe', { static: false } ) iframe: ElementRef<HTMLIFrameElement>;
  @Input() url: string;
  @Input() onVideoLoad: Function;

  environment = environment;

  AppMode = AppMode;
  VideoType = VideoType;

  isUnmeteredConnection: boolean;
  clickGuardDisabled = false;
  sanitizedUrl: SafeResourceUrl;
  type: VideoType;
  subscription: Subscription;

  constructor(
    public miscService: MiscService,
    private _network: Network,
    private _domSanitizer: DomSanitizer,
    private _changeDetector: ChangeDetectorRef
  ) {
    this.onVideoLoad = () => {};
  }

  private _determineNetworkType() {
    // determine whether the user is on a fast (likely non-metered) connection
    this.isUnmeteredConnection = [
      this._network.Connection.ETHERNET,
      this._network.Connection.WIFI,
      this._network.Connection.NONE,
      null
    ].includes( this._network.type );
    this._changeDetector.detectChanges();
  }

  ngOnInit() {
    this._initializeVideo();
    this._determineNetworkType();
    this.subscription = this._network.onChange().subscribe( () => this._determineNetworkType() );
  }

  ngOnChanges() {
    this._initializeVideo();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  load() {
    setTimeout( () => this.onVideoLoad(), 100 );
  }

  private _initializeVideo() {
    if ( this.url ) {
      const video = this.miscService.getEmbeddableVideo( this.url );
      this.type = video.type;
      this.sanitizedUrl = this._domSanitizer.bypassSecurityTrustResourceUrl( video.url );
    }
  }

}
