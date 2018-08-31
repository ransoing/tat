import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RedFlagsPage } from './red-flags.page';
import { CommonComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: RedFlagsPage
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
  declarations: [RedFlagsPage]
})
export class RedFlagsPageModule {}
