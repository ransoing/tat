import { Component } from '@angular/core';
import { staticImplements } from '../../models/static-implements';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  templateUrl: './red-flags-sex-movers.component.html'
})
export class RedFlagsSexMoversComponent {

  /** required for analytics to log a view to this modal */
  static screenName = 'Red Flags / Movers';

  public modal: HTMLIonModalElement;

  constructor() { }

}
