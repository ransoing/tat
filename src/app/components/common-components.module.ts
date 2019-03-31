import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ImageButtonComponent } from './image-button/image-button.component';
import { ResponsiveImageComponent } from './responsive-image/responsive-image.component';

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule],
  exports: [ImageButtonComponent, ResponsiveImageComponent, TranslateModule],
  declarations: [ImageButtonComponent, ResponsiveImageComponent]
})
export class CommonComponentsModule {}
