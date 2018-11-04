import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalGuard } from './modal-guard.service';
import {
  POSPart1Page, POSPart2Page, POSPart3Page, POSPart4Page,
  PORPart1Page, PORPart2Page, PORPart3Page, PORPart4Page, PORPart5Page
} from './pages';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'pos-1', component: POSPart1Page, canDeactivate: [ModalGuard] },
  { path: 'pos-2', component: POSPart2Page, canDeactivate: [ModalGuard] },
  { path: 'pos-3', component: POSPart3Page, canDeactivate: [ModalGuard] },
  { path: 'pos-4', component: POSPart4Page, canDeactivate: [ModalGuard] },
  { path: 'por-1', component: PORPart1Page, canDeactivate: [ModalGuard] },
  { path: 'por-2', component: PORPart2Page, canDeactivate: [ModalGuard] },
  { path: 'por-3', component: PORPart3Page, canDeactivate: [ModalGuard] },
  { path: 'por-4', component: PORPart4Page, canDeactivate: [ModalGuard] },
  { path: 'por-5', component: PORPart5Page, canDeactivate: [ModalGuard] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
