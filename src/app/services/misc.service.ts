import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MiscService {

  isLoggedIn: boolean = false;
  loginRedirectUrl: string;
  routeHereCallbacks = [];
  callbackToSave: Boolean | Function = false;

  constructor(
    private router: Router
  ) {

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

  public onRouteHere( callback: Function ) {
    this.callbackToSave = callback;
  }
}