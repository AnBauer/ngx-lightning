import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglPillComponent } from './pill';
import { NglPillImageDirective } from './pill-image';
import { NglPillLinkDirective } from './pill-link';
import { NglPillRemoveDirective } from './pill-remove';
import { NglIconsModule } from '../icons/module';

const NGL_PILL_DIRECTIVES = [
  NglPillComponent,
  NglPillImageDirective,
  NglPillLinkDirective,
  NglPillRemoveDirective,
];

@NgModule({
  declarations: [NGL_PILL_DIRECTIVES],
  exports: [NGL_PILL_DIRECTIVES],
  imports: [CommonModule, NglIconsModule],
})
export class NglPillsModule {}
