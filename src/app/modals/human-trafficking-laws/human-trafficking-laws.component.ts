import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppMode } from '../../models/app-mode';
import { staticImplements } from '../../models/static-implements';
import { MiscService } from '../../services';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  selector: 'app-human-trafficking-laws',
  templateUrl: './human-trafficking-laws.component.html',
  styleUrls: ['./human-trafficking-laws.component.scss']
})
export class HumanTraffickingLawsComponent {

  /** required for analytics to log a view to this modal */
  static screenName = 'Resources / Human Trafficking Laws';

  public modal: HTMLIonModalElement;
  environment = environment;
  AppMode = AppMode;
  
  constructor( public miscService: MiscService ) { }

}
