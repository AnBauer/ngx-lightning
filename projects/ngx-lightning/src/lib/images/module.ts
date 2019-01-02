import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglAvatarComponent } from './avatar';
import { NglFigureComponent } from './figure';
import { NglFigureCropDirective } from './figure-crop';

@NgModule({
  declarations: [NglAvatarComponent, NglFigureComponent, NglFigureCropDirective],
  exports: [NglAvatarComponent, NglFigureComponent, NglFigureCropDirective],
  imports: [CommonModule],
})
export class NglImagesModule {}
