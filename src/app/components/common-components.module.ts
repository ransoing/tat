import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ImageButtonComponent } from './image-button/image-button.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [ImageButtonComponent, TranslateModule],
  declarations: [ImageButtonComponent]
})
export class CommonComponentsModule {}
