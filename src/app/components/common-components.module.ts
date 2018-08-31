import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageButtonComponent } from './image-button/image-button.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [ImageButtonComponent],
  declarations: [ImageButtonComponent]
})
export class CommonComponentsModule {}
