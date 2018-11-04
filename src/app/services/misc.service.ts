import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MiscService {

  constructor() { }

  public openExternalLink( url ) {
      window.open( url, '_system' );
  }
}