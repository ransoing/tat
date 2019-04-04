import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController, NavController } from '@ionic/angular';
import { TrxService } from './trx.service';
import { ModalService } from './modal.service';

export enum StorageKeys {
  USER_DATA = 'user_data'
}

@Injectable({
  providedIn: 'root',
})
export class MiscService {

  isLoggedIn: boolean = false;
  loginRedirectUrl: string;
  routeHereCallbacks = [];
  callbackToSave: Boolean | Function = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private trx: TrxService,
    private navCtrl: NavController,
    private modalService: ModalService
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
      window.open( url, '_system' );
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
    this.navCtrl.navigateRoot( '/tabs/(home:home)' );
    let activeModal = this.modalService.getActiveModal();
    if ( activeModal ) {
      activeModal.dismiss();
    }
  }

  /**
   * Shows a small alert on the screen, with a close button.
   * @param message The text to show in the body of the alert
   * @returns A Promise which resolves when the alert has been dismissed.
   */
  public showSimpleAlert( title: string, message: string ): Promise<null> {
    return new Promise( async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: [await this.trx.t( 'misc.buttons.close' )]
      });
      alert.present();
      alert.onDidDismiss().then( () => {
        resolve();
      });
    });
  }
}