import { Component, Input } from '@angular/core';
import { MiscService } from '../../services';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * This component shows images whose URLs are defined in the firebase database.
 * The database stores image URLs in this heirarchy:
 * images: {
 *   {
 *     some-image-name: {
 *       phone: "some-url",
 *       tablet: "some-url"
 *     },
 *     some-other-image-name: {
 *       ...
 *     }
 *   }
 * }
 */

@Component({
  selector: 'responsive-image',
  templateUrl: './responsive-image.component.html',
  styleUrls: ['./responsive-image.component.scss']
})
export class ResponsiveImageComponent {
  @Input() altTagKey: string; // the translation key to be used for the alt tag
  @Input() imageName: string; // the name of the image, which is the parent of the 'phone' and 'tablet' keys in the firebase object, i.e. 'ht-laws'
  
  private storageKey = 'firebase-image-urls';
  public imageUrls;

  constructor(
    public miscService: MiscService,
    private storage: Storage,
    private http: HttpClient
  ) {
    this.getImageUrls();
  }

  async getImageUrls() {
    // get the URL of the image. The image's URL may be updated at any point.
    // The URL is cached. The cache invalidates after a day.
    let urlsCache = await this.storage.get( this.storageKey );
    if ( !urlsCache || urlsCache.expires < new Date() ) {
      // get new images.
      this.http.get( environment.firebaseConfig.databaseURL + '/images.json' ).toPromise().then( data => {
        this.imageUrls = data;
        // save to the cache
        let expireDate = new Date();
        expireDate.setDate( expireDate.getDate() + 1 );
        this.storage.set( this.storageKey, {imageUrls: this.imageUrls, expires: expireDate} );
      });
    } else {
      this.imageUrls = urlsCache.imageUrls;
    }
  }

}
