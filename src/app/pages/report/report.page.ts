import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WhatToReportComponent } from '../../modals/what-to-report/what-to-report.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  constructor( public modalController: ModalController ) { }

  ngOnInit() {
  }

  async openWhatToReportModal() {
    const modal = await this.modalController.create({
      component: WhatToReportComponent,
      componentProps: {}
    });
    return await modal.present();
  }

}
