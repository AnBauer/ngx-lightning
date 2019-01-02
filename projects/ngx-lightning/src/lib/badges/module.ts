import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglBadgeComponent } from './badge';

@NgModule({
  declarations: [NglBadgeComponent],
  exports: [NglBadgeComponent],
  imports: [CommonModule],
})
export class NglBadgesModule {}
