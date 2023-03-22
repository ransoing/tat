import { Component } from '@angular/core';
import { staticImplements } from '../../models/static-implements';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  templateUrl: './red-flags-sex-local.component.html'
})
export class RedFlagsSexLocalComponent {

  /** required for analytics to log a view to this modal */
  static screenName = 'Sex Trafficking Red Flags / Local Drivers';

  public modal: HTMLIonModalElement;

  constructor() { }

}
