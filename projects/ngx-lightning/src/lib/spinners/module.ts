import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglSpinnerComponent } from './spinner';

@NgModule({
  declarations: [NglSpinnerComponent],
  exports: [NglSpinnerComponent],
  imports: [CommonModule],
})
export class NglSpinnersModule {}
