import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalGuard, AuthGuard } from './guards';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
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
