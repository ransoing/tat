import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscriber, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MiscService {

  isLoggedIn: boolean = false;
  loginRedirectUrl: string;
  routeHereCallbacks = [];
  callbackToSave: Boolean | Function = false;
  getFeedbackSubmitted: Observable<MessageEvent>;

  constructor(
    private router: Router
  ) {
    this.getFeedbackSubmitted = new Observable( observer => {
      // An iframe that contains a getfeedback survey will send a message with a specific signature when done
      window.addEventListener( 'message', async message => {
        if ( message.data === 'submittedResponse' && message.origin === 'https://www.getfeedback.com' ) {
          observer.next( message );
        }
      });
    });

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
}