import { Injectable } from '@angular/core';
import { ISurvey } from '../models/survey';
import { ISurveyService } from '../models/services';
import { IOutreachLocation } from '../models/user-data';
import { UserDataService } from './user-data.service';
import { ProxyAPIService } from './proxy-api.service';
import { MiscService } from './misc.service';
import { TrxService } from './trx.service';
import { ScriptService } from './script.service';

// All the surveys are defined in an externally loaded script, external/src/surveys.external.service.ts
// This service is a wrapper for that externally loaded service;
// it provides convenient methods to load that external script and generate a specific survey.

@Injectable({
  providedIn: 'root',
})
export class SurveyService implements ISurveyService {

  constructor(
    private scripts: ScriptService,
    private userDataService: UserDataService,
    private proxyAPI: ProxyAPIService,
    private miscService: MiscService,
    private trxService: TrxService
  ) {}

  async preOutreachSurvey( numLocations: number ): Promise<ISurvey> {
    return ( await this._loadExternalScript() ).preOutreachSurvey( numLocations );
  }

  async postOutreachSurvey( location: IOutreachLocation ): Promise<ISurvey> {
    return ( await this._loadExternalScript() ).postOutreachSurvey( location );
  }

  // preEventSurvey

  // postEventSurvey

  async testimonialFeedbackSurvey( campaignId?: string ): Promise<ISurvey> {
    return ( await this._loadExternalScript() ).testimonialFeedbackSurvey( campaignId );
  }

  async signupSurvey(): Promise<ISurvey> {
    return ( await this._loadExternalScript() ).signupSurvey();
  }

  async editAccountSurvey(): Promise<ISurvey> {
    return ( await this._loadExternalScript() ).editAccountSurvey();
  }

  /** a helper function to load the external script and construct the service */
  private async _loadExternalScript(): Promise<ISurveyService> {
    await this.scripts.loadScript( 'surveys', false );
    // construct the service, passing the dependencies that it needs
    const externalService = window['ExternalSurveyService']( this.userDataService, this.proxyAPI, this.miscService, this.trxService );
    return externalService as ISurveyService;
  }
}
