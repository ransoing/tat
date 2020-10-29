import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentsModule } from '../components/common-components.module';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';
import { TabsPage } from './tabs.page';
import {
  HomePageModule,
  RedFlagsLaborPageModule,
  RedFlagsSexPageModule,
  ReportPageModule,
  ResourcesPageModule,
  VolunteerPageModule
} from '../pages';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    CommonComponentsModule,
    HomePageModule, RedFlagsLaborPageModule, RedFlagsSexPageModule, ReportPageModule, ResourcesPageModule, VolunteerPageModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
