import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'report', loadChildren: './pages/report/report.module#ReportPageModule' },
  { path: 'red-flags', loadChildren: './pages/red-flags/red-flags.module#RedFlagsPageModule' },
  { path: 'resources', loadChildren: './pages/resources/resources.module#ResourcesPageModule' },
  { path: 'volunteer', loadChildren: './pages/volunteer/volunteer.module#VolunteerPageModule' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
