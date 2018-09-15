import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalGuard } from '../modal-guard.service';

import { TabsPage } from './tabs.page';
import { HomePage, RedFlagsPage, ReportPage, ResourcesPage, VolunteerPage } from '../pages';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [ModalGuard],
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
        canActivate: [ModalGuard]
      }, {
        path: 'home',
        outlet: 'home',
        component: HomePage,
        canActivate: [ModalGuard]
      }, {
        path: 'report',
        outlet: 'report',
        component: ReportPage,
        canActivate: [ModalGuard]
      }, {
        path: 'red-flags',
        outlet: 'red-flags',
        component: RedFlagsPage,
        canActivate: [ModalGuard]
      }, {
        path: 'resources',
        outlet: 'resources',
        component: ResourcesPage,
        canActivate: [ModalGuard]
      }, {
        path: 'volunteer',
        outlet: 'volunteer',
        component: VolunteerPage,
        canActivate: [ModalGuard]
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
