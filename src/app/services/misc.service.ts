import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MiscService {

  isLoggedIn: boolean = false;
  loginRedirectUrl: string;

  constructor() { }

  public openExternalLink( url ) {
      window.open( url, '_system' );
  }
}