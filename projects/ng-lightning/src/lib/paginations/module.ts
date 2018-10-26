import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglPaginationComponent } from './pagination';

@NgModule({
  declarations: [NglPaginationComponent],
  exports: [NglPaginationComponent],
  imports: [CommonModule],
})
export class NglPaginationsModule {}
