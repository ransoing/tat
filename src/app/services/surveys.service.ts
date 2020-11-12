import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { ISurvey } from '../models/survey';
import { ISurveyService } from '../models/services';
import { IOutreachLocation, IAmbassadorEvent } from '../models/user-data';
import { UserDataService } from './user-data.service';
import { ProxyAPIService } from './proxy-api.service';
import { MiscService } from './misc.service';
import { TrxService } from './trx.service';
import { ScriptService } from './script.service';
import { environment } from '../../environments/environment';
import { parseVersionString } from '../models/version';

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
    private trxService: TrxService,
    private translateService: TranslateService,
    private http: HttpClient
  ) {}

  async preOutreachSurvey( numLocations: number ): Promise<ISurvey> {
    return this._loadSurvey( externalScript => externalScript.preOutreachSurvey(numLocations) );
  }

  async postOutreachSurvey( location: IOutreachLocation ): Promise<ISurvey> {
    return this._loadSurvey( externalScript => externalScript.postOutreachSurvey(location) );
  }

  // preEventSurvey

  async postEventSurvey( event: IAmbassadorEvent ): Promise<ISurvey> {
    return this._loadSurvey( externalScript => externalScript.postEventSurvey(event) );
  }

  async testimonialFeedbackSurvey( campaignId?: string ): Promise<ISurvey> {
    return this._loadSurvey( externalScript => externalScript.testimonialFeedbackSurvey(campaignId) );
  }

  async signupSurvey(): Promise<ISurvey> {
    return this._loadSurvey( externalScript => externalScript.signupSurvey() );
  }

  async editAccountSurvey(): Promise<ISurvey> {
    return this._loadSurvey( externalScript => externalScript.editAccountSurvey() );
  }

  /** a helper function to coordinate the timing of loading the external survey service, generating the survey, and hiding a loading popup */
  private async _loadSurvey( scriptCallback: (s: ISurveyService) => Promise<ISurvey> ): Promise<ISurvey> {
    const externalScript = await this._loadExternalScript();
    const survey = await scriptCallback( externalScript );
    this.miscService.hideLoadingPopup();
    return survey;
  }

  /** a helper function to load the external script and construct the service */
  private async _loadExternalScript(): Promise<ISurveyService> {
    await this.miscService.showLoadingPopup();

    try {
      // discover whether the external script is compatible with the running version of the app
      const appVer = parseVersionString( environment.version );
      const remoteVersionString = await this.http.get( `${environment.externalResourcesURL}version` ).toPromise();
      const remoteVer = parseVersionString( remoteVersionString as string );

      if ( remoteVer.major === appVer.major && remoteVer.minor === appVer.minor ) {
        // load the script that contains the surveys (and don't cache it) every time the user wants to fill out a survey
        // also reload the translations file from the server, because if the surveys are updated, the translations are likely to be updated as well
        await Promise.all([
          this.scripts.loadScript( 'surveys', false ),
          this.translateService.reloadLang( this.translateService.currentLang ).toPromise()
        ]);
      } else {
        await this.miscService.hideLoadingPopup();
        this.miscService.showErrorPopup( 'misc.messages.updateRequired' );
        return;
      }
    } catch ( e ) {
      await this.miscService.hideLoadingPopup();
      this.miscService.showErrorPopup( e.status === 0 ? 'misc.messages.requestErrorNetwork' : 'misc.messages.requestErrorUnknown' );
      return;
    }
    
    // construct the service, passing the dependencies that it needs
    const externalService = new window['ExternalSurveyService']( this.userDataService, this.proxyAPI, this.miscService, this.trxService );
    return externalService as ISurveyService;
  }
}
