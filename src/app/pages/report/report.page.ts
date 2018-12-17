import { Component } from '@angular/core';
import { WhatToReportComponent, EmailReportComponent } from '../../modals';
import { ModalService, MiscService } from '../../services';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage {

  WhatToReportComponent = WhatToReportComponent;
  EmailReportComponent = EmailReportComponent;

  constructor( public modalService: ModalService, public miscService: MiscService ) {}
}
