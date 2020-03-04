import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * The URLs of some resources (images and videos) are stored in a Firebase database, and can be easily changed anytime.
 * This service provides an easy way to access those URLs.
 */

@Injectable({
  providedIn: 'root',
})
export class DynamicURLsService {
  
  private storageKey = 'dynamic-urls';

  constructor(
    private storage: Storage,
    private http: HttpClient
  ) {
    this.getURLs();
  };

  async getURLs() {
    /**
     * get the dynamic URLs from firebase.
     * The URLs are cached. The cache invalidates after a day.
     * the cache is saved in the format:
     * {
     *   urls: {}, // the data as it is retrieved from firebase
     *   expires: Date // when to get new data from firebase
     * }
     */
    let cache = await this.storage.get( this.storageKey );
    // cache.expires might be a Date or a ISO string. Convert to a Date for easy comparison
    if ( cache && typeof cache.expires === 'string' ) {
      cache.expires = new Date( cache.expires );
    }
    if ( !cache || cache.expires < new Date() ) {
      // get new images.
      let data;
      try {
        data = await this.http.get( environment.firebaseConfig.databaseURL + '/urls.json' ).toPromise();
      } catch (e) {
        // couldn't get URLs. return something.
        return cache ? cache.urls : {};
      }
      // save to the cache
      let expireDate = new Date();
      expireDate.setDate( expireDate.getDate() + 1 );
      this.storage.set( this.storageKey, {urls: data, expires: expireDate} );
      return data;
    } else {
      return cache.urls;
    }
  }

}