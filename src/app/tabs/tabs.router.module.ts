import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards';

import { TabsPage } from './tabs.page';
import { HomePage, RedFlagsLaborPage, RedFlagsSexPage, ReportPage, ResourcesPage, VolunteerPage } from '../pages';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }, {
        path: 'home',
        component: HomePage
      }, {
        path: 'report',
        component: ReportPage
      }, {
        path: 'red-flags/sex',
        component: RedFlagsSexPage
      }, {
        path: 'red-flags/labor',
        component: RedFlagsLaborPage
      }, {
        path: 'resources',
        component: ResourcesPage
      }, {
        path: 'volunteer',
        component: VolunteerPage,
        canActivate: [AuthGuard]
      }
    ]
  }, {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
