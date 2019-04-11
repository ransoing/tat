import { Component, Input } from '@angular/core';
import { MiscService, DynamicURLsService } from '../../services';

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
  
  public imageUrls;

  constructor(
    public miscService: MiscService,
    public dynamicURLs: DynamicURLsService
  ) {
    this.dynamicURLs.getURLs().then( urls => {
      this.imageUrls = urls.images;
    });
  }

}
