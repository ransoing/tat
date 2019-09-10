import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ITrxService } from '../models/services';

/** This is a shorthand way to translate in typescript using the ngx-translate TranslateService */
@Injectable({
  providedIn: 'root',
})
export class TrxService implements ITrxService {

  constructor( private translateService: TranslateService ) {}

  public async t( key: string, params: any = {} ) {
    return await this.translateService.get( key, params ).toPromise();
  }
}
