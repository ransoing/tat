import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { TrxService } from './trx.service';
import { ModalService } from './modal.service';
import { IEmbeddableVideo, VideoType } from '../models/video';
import { IMiscService } from '../models/services';
import { QrModalComponent } from '../modals/qr/qr-modal.component';
import { environment } from '../../environments/environment';
import { AppMode } from '../models/app-mode';

export enum StorageKeys {
  USER_DATA = 'user_data'
}

@Injectable({
  providedIn: 'root',
})
export class MiscService implements IMiscService {

  isLoggedIn: boolean = false;
  loginRedirectUrl: string;
  routeHereCallbacks = [];
  callbackToSave: Boolean | Function = false;
  languageLoaded = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private trx: TrxService,
    private navCtrl: NavController,
    private modalService: ModalService,
    private loadingController: LoadingController
  ) {
    // listen for route changes. This subscriber is used for onRouteHere
    this.router.events.subscribe( event => {
      if ( event instanceof NavigationEnd ) {
        if ( this.callbackToSave ) {
          // store the callback
          this.routeHereCallbacks[ event.urlAfterRedirects ] = this.callbackToSave;
          this.callbackToSave = false;
        }

        // any URL could have been routed to. If a callback is stored for the routed URL, fire it
        let callback = this.routeHereCallbacks[ event.urlAfterRedirects ];
        if ( callback ) {
          callback();
        }
      }
    });
  }

  public openExternalLink( url ) {
    if ( environment.app === AppMode.TAT ) {
      window.open( url, '_system' );
    } else {
      // show a QR code that will lead the user to the content
      this.modalService.open( QrModalComponent, { url: url } );
    }
  }

  /**
   * With ionic tabs, a tab's component stays initialized even after switching to other tabs, so something like
   * `afterViewInit` will only fire the first time the tab is browsed to (until the component with <ion-tabs> is unloaded).
   * Because of this, in order to create a function which reliably executes when the tab is navigated to, we must listen to
   * the router (assuming that the tab has its own route). A component that uses `onRouteHere` should call it once in its
   * constructor. The callback function will be called every time that component is navigated to (including the first time).
   * @param callback 
   */
  public onRouteHere( callback: Function ) {
    this.callbackToSave = callback;
  }

  /**
   * Navigate to the home page and close the active modal.
   */
  public goBackHome() {
    this.navCtrl.navigateRoot( '/tabs/home' );
    let activeModal = this.modalService.getActiveModal();
    if ( activeModal ) {
      activeModal.dismiss();
    }
  }

  /**
   * Shows a small alert on the screen, with a close button.
   * @param titleTranslationKey The translation key of the title of the alert
   * @param messageTranslationKey The translation key of the text to show in the body of the alert
   * @returns A Promise which resolves when the alert has been dismissed.
   */
  public showSimpleAlert( titleTranslationKey: string, messageTranslationKey: string ): Promise<void> {
    return new Promise( async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: await this.trx.t( titleTranslationKey ),
        message: await this.trx.t( messageTranslationKey ),
        buttons: [await this.trx.t( 'misc.buttons.close' )]
      });
      alert.present();
      alert.onDidDismiss().then( () => {
        resolve();
      });
    });
  }

  /**
   * Shows an error message. By default, shows a message appropriate for when some HTTP request has failed.
   */
  public async showErrorPopup( translationKey = 'misc.messages.requestError' ) {
    return this.showSimpleAlert(
      await this.trx.t( 'misc.error' ),
      await this.trx.t( translationKey )
    );
  }

  /**
   * Shows a loading popup, ensuring that only one loading popup exists at a time.
   */
  public async showLoadingPopup(): Promise<any> {
    let popup = await this.loadingController.getTop();
    if ( popup ) {
      // there is already a popup. quit now.
      return this.loadingController.getTop();
    }
    // create and present the loading popup
    popup = await this.loadingController.create({
      message: await this.trx.t( 'misc.messages.pleaseWait' )
    });
    return popup.present();
  }

  /**
   * Hides the loading popup, if one exists
   */
  public async hideLoadingPopup() {
    let popup = await this.loadingController.getTop();
    if ( popup ) {
      popup.dismiss();
    }
  }


  /**
   * Takes a date object, and returns the local date as YYYY-MM-DD
   * @param date A Date object or ISO-8601 formatted datestring
   */
  public dateToLocalYYYYMMDD( date: Date | string ): string {
    try {
      if ( typeof date === 'string' ) date = new Date( date );
      // undo the timezone offset so that .toISOString() outputs the local date/time instead of UTC date/time
      const alteredDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000 ).toISOString();
      // return the segment before the 'T'
      return alteredDate.split( 'T' )[0];
    } catch(e) {
      // invalid date.
      return '';
    }
  }

  public waitForLanguageLoaded(): Promise<void> {
    return new Promise( resolve => {
      if ( this.languageLoaded ) {
        resolve();
      } else {
        const interval = setInterval( () => {
          if ( this.languageLoaded ) {
            clearInterval( interval );
            resolve();
          }
        }, 200 );
      }
    });
  }

  /**
   * Takes any youtube or vimeo URL and returns a URL which can be used for embedding a video on a page.
   */
  public getEmbeddableVideo( url: string ): IEmbeddableVideo {
    let videoId: string;
    if ( url.substr(0,17) === 'https://youtu.be/' ) {
      // format: https://youtu.be/{videoId}?t={startTimestamp}
      videoId = url.substr( 17 ).split( '?' )[0];
      return {
        url: this.makeYoutubeEmbedURL( videoId ),
        type: VideoType.YOUTUBE
      };
    } else if ( url.substr(0,24) === 'https://www.youtube.com/' ) {
      // format: https://www.youtube.com/watch?v={videoId}&t={startTimestamp}s
      videoId = url.substr( 24 + 8 ).split( '&' )[0];
      return {
        url: this.makeYoutubeEmbedURL( videoId ),
        type: VideoType.YOUTUBE
      };
    } else if ( url.substr(0,18) === 'https://vimeo.com/' ) {
      // format: https://vimeo.com/{videoId}/{moreStuff}
      // Turn this into {videoId}?h={moreStuff}
      videoId = url.substr( 18 ).replace( '/', '?h=' );
      return {
        url: this.makeVimeoEmbedURL( videoId ),
        type: VideoType.VIMEO
      };
    } else {
      throw 'Unable to parse video URL: ' + url;
    }
  }

  private makeYoutubeEmbedURL( videoId: string ): string {
    return 'https://www.youtube.com/embed/' + videoId + '?rel=0&enablejsapi=1';
  }
  private makeVimeoEmbedURL( videoId: string ): string {
    return 'https://player.vimeo.com/video/' + videoId + ( videoId.includes('?') ? '&' : '?' ) + 'title=0&portrait=0';
  }

}
