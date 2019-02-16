import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrxService, MiscService, GetFeedbackService } from '../../services';

@Component({
  templateUrl: './getfeedback-survey.component.html'
})
export class GetFeedbackSurveyComponent implements OnInit, OnDestroy {

  /**
   * This component opens any GetFeedback survey inside a modal.
   */

  @Input('onSurveyFinished') onSurveyFinished: Function;
  @Input('surveyUrl') surveyUrl: Function;
  @Input('titleTranslationKey') titleTranslationKey: string;
  @Input('successTranslationKey') successTranslationKey: string;

  public modal: HTMLIonModalElement;
  public gfSurveyUrl;
  private gfSubscription: Subscription;
  
  constructor(
    public miscService: MiscService,
    public getFeedbackService: GetFeedbackService,
    public trx: TrxService
  ) {}

  ngOnInit() {
    // wait for the survey to be submitted
    this.gfSubscription = this.getFeedbackService.surveySubmitted.subscribe( async message => {
      // close the modal and show a success message
      this.modal.dismiss();
      this.miscService.showSimpleAlert( await this.trx.t( 'misc.success' ), await this.trx.t( this.successTranslationKey ) )
      .then( () => {
        this.onSurveyFinished();
      });
    });
  }

  ngOnDestroy() {
    this.gfSubscription.unsubscribe();
  }

}
