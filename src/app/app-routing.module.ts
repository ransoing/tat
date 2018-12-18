import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalGuard, AuthGuard } from './guards';
import {
  POSPart1Page, POSPart2Page, POSPart3Page, POSPart4Page,
  PORPart1Page, PORPart2Page, PORPart3Page
} from './pages';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'pos-1', component: POSPart1Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] },
  { path: 'pos-2', component: POSPart2Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] },
  { path: 'pos-3', component: POSPart3Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] },
  { path: 'pos-4', component: POSPart4Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] },
  { path: 'por-1', component: PORPart1Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] },
  { path: 'por-2', component: PORPart2Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] },
  { path: 'por-3', component: PORPart3Page, canDeactivate: [ModalGuard], canActivate: [AuthGuard] }
];
@NgModule({
  // using hash in the URL makes it easy for references to images to work, despite whether the root
  // of the app is at / or at some long path. All image references just have to start with no slash,
  // and that will make it relative to the root of the app, and we don't have to know the app root
  // before building.
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
