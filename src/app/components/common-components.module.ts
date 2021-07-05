import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ImageButtonComponent } from './image-button/image-button.component';
import { ResponsiveImageComponent } from './responsive-image/responsive-image.component';
import { ChevronSVG } from './chevron-svg/chevron-svg.component';
import { IndustrySelectorComponent } from './industry-selector/industry-selector.component';
import { CollapsiblePanelComponent } from './collapsible-panel/collapsible-panel.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule, FormsModule],
  exports: [
    TranslateModule,
    ImageButtonComponent, ResponsiveImageComponent, ChevronSVG, IndustrySelectorComponent,
    CollapsiblePanelComponent, VideoPlayerComponent
  ],
  declarations: [
    ImageButtonComponent, ResponsiveImageComponent, ChevronSVG, IndustrySelectorComponent,
    CollapsiblePanelComponent, VideoPlayerComponent
  ]
})
export class CommonComponentsModule {}
