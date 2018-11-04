import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/** This is a shorthand way to translate in javascript using the ngx-translate TranslateService */
@Injectable({
  providedIn: 'root',
})
export class TrxService {

  constructor( private translateService: TranslateService ) { }

  public async t( key: string ) {
    return await this.translateService.get( key ).toPromise();
  }
}