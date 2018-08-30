import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage, RedFlagsPage, ReportPage, ResourcesPage, VolunteerPage } from '../pages';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'report',
        outlet: 'report',
        component: ReportPage
      },
      {
        path: 'red-flags',
        outlet: 'red-flags',
        component: RedFlagsPage
      },
      {
        path: 'resources',
        outlet: 'resources',
        component: ResourcesPage
      },
      {
        path: 'volunteer',
        outlet: 'volunteer',
        component: VolunteerPage
      }
    ]
  },
  {
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
