import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';

/** A modal that, when viewed, has that activity logged in analytics */
export interface IViewLoggedModal {
    screenName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  /** the name of the page currently being viewed. This must not include modals. */
  currentPageName: string;

  constructor(
    private _firebase: FirebaseX
  ) { }

  /** Use this method to log a page view in Firebase Anlytics */
  public logPageView( pageName: string ) {
    this.currentPageName = pageName;
    this._firebase.setScreenName( pageName );
  }

  /** Use this method to log a modal view in Firebase Anlytics */
  public logModalView( modalName: string ) {
    this._firebase.setScreenName( modalName );
  }

  public logPhoneNumberLink( url: string ) {
    this._firebase.logEvent( 'Clicked phone number link', url );
  }

  public logTextMessageLink( url: string ) {
    this._firebase.logEvent( 'Clicked SMS message link', url );
  }

  public logEmailLink( url: string ) {
    this._firebase.logEvent( 'Clicked email link', url );
  }

  public logUrlLink( url: string ) {
    this._firebase.logEvent( 'Clicked URL link', url );
  }
}
