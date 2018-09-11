import { Component, OnInit } from '@angular/core';
import { WhatToReportComponent } from '../../modals';
import { ModalService } from '../../services';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  WhatToReportComponent = WhatToReportComponent;

  constructor( public modalService: ModalService ) {}

  ngOnInit() {
  }

}
