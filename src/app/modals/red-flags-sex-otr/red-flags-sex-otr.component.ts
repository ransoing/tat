import { Component } from '@angular/core';
import { staticImplements } from '../../models/static-implements';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  templateUrl: './red-flags-sex-otr.component.html'
})
export class RedFlagsSexOtrComponent {

  /** required for analytics to log a view to this modal */
  static screenName = 'Sex Trafficking Red Flags / OTR Drivers';

  public modal: HTMLIonModalElement;

  constructor() { }

}
