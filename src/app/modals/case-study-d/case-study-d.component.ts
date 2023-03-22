import { Component, OnInit } from '@angular/core';
import { staticImplements } from '../../models/static-implements';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  selector: 'app-case-study-d',
  templateUrl: './case-study-d.component.html',
  styleUrls: ['./case-study-d.component.scss']
})
export class CaseStudyDComponent implements OnInit {

  /** required for analytics to log a view to this modal */
  static screenName = 'Sex Trafficking Red Flags / Case Study: Branding';

  public modal: HTMLIonModalElement;
  
  constructor() { }

  ngOnInit() {
  }

}
