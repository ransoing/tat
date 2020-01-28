import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalGuard, AuthGuard } from '../guards';

import { TabsPage } from './tabs.page';
import { HomePage, RedFlagsPage, ReportPage, ResourcesPage, VolunteerPage } from '../pages';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canDeactivate: [ModalGuard],
    children: [
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
        canDeactivate: [ModalGuard]
      }, {
        path: 'home',
        component: HomePage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'report',
        component: ReportPage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'red-flags',
        component: RedFlagsPage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'resources',
        component: ResourcesPage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'volunteer',
        component: VolunteerPage,
        canDeactivate: [ModalGuard],
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
