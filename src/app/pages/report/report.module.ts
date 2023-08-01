import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportPage } from './report.page';
import { CommonComponentsModule } from '../../components/common-components.module';
import { Device } from '@ionic-native/device/ngx';

const routes: Routes = [
  {
    path: '',
    component: ReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CommonComponentsModule
  ],
  providers: [ Device ],
  declarations: [ReportPage]
})
export class ReportPageModule {}
