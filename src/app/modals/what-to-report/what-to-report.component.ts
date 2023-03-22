import { Component, OnInit } from '@angular/core';
import { staticImplements } from '../../models/static-implements';
import { IViewLoggedModal } from '../../services/analytics.service';

@staticImplements<IViewLoggedModal>()
@Component({
  selector: 'app-what-to-report',
  templateUrl: './what-to-report.component.html',
  styleUrls: ['./what-to-report.component.scss']
})
export class WhatToReportComponent implements OnInit {

  /** required for analytics to log a view to this modal */
  static screenName = 'Report Activity / What to Report';

  public modal: HTMLIonModalElement;

  constructor( ) {}

  ngOnInit() {
  }

}
