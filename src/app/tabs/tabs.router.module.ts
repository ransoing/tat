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
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
        canDeactivate: [ModalGuard]
      }, {
        path: 'home',
        outlet: 'home',
        component: HomePage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'report',
        outlet: 'report',
        component: ReportPage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'red-flags',
        outlet: 'red-flags',
        component: RedFlagsPage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'resources',
        outlet: 'resources',
        component: ResourcesPage,
        canDeactivate: [ModalGuard]
      }, {
        path: 'volunteer',
        outlet: 'volunteer',
        component: VolunteerPage,
        canDeactivate: [ModalGuard],
        canActivate: [AuthGuard]
      }
    ]
  }, {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
