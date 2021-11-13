import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RedFlagsSexPage } from './red-flags-sex.page';
import { CommonComponentsModule } from '../../components/common-components.module';
import { RedFlagsSexSectionComponent } from './components/red-flags-sex-section.component';
import { RedFlagsSexOtrComponent, RedFlagsSexLocalComponent, RedFlagsSexMoversComponent } from '../../modals';

const routes: Routes = [
  {
    path: '',
    component: RedFlagsSexPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CommonComponentsModule
  ],
  declarations: [
    RedFlagsSexPage,
    RedFlagsSexSectionComponent,
    RedFlagsSexOtrComponent,
    RedFlagsSexLocalComponent,
    RedFlagsSexMoversComponent
  ],
  entryComponents: [
    RedFlagsSexOtrComponent,
    RedFlagsSexLocalComponent,
    RedFlagsSexMoversComponent
  ]
})
export class RedFlagsSexPageModule {}
