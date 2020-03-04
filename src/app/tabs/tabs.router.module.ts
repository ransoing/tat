import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards';

import { TabsPage } from './tabs.page';
import { HomePage, RedFlagsPage, ReportPage, ResourcesPage, VolunteerPage } from '../pages';

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
        path: 'red-flags',
        component: RedFlagsPage
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
