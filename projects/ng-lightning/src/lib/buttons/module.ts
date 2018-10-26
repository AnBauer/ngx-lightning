import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglButtonDirective } from './button';
import { NglButtonStateDirective } from './button-state';
import { NglButtonIconDirective } from './button-icon';

const NGL_BUTTON_DIRECTIVES = [
  NglButtonDirective,
  NglButtonStateDirective,
  NglButtonIconDirective,
];

@NgModule({
  declarations: NGL_BUTTON_DIRECTIVES,
  exports: NGL_BUTTON_DIRECTIVES,
  imports: [CommonModule],
})
export class NglButtonsModule {}
