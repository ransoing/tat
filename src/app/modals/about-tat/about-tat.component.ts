import { Component } from '@angular/core';
import { MiscService } from '../../services';
import { environment } from '../../../environments/environment';
import { staticImplements } from '../../models/static-implements';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  templateUrl: './about-tat.component.html'
})
export class AboutTatComponent {

  /** required for analytics to log a view to this modal */
  static screenName = 'Resources / About TAT';

  public modal: HTMLIonModalElement;
  public lastYear = ( new Date().getFullYear() ) - 1;
  environment = environment

  constructor( public miscService: MiscService ) { }

}
