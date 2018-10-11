import { Component, OnInit } from '@angular/core';
import { WhatToReportComponent, EmailReportComponent } from '../../modals';
import { ModalService } from '../../services';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  WhatToReportComponent = WhatToReportComponent;
  EmailReportComponent = EmailReportComponent;

  constructor( public modalService: ModalService ) {}

  ngOnInit() {
  }

}
