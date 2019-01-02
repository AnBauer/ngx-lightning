import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NglDropdownTriggerDirective } from './dropdown-trigger';
import { NglDropdownDirective } from './dropdown';
import { NglDropdownItemDirective } from './dropdown-item';

const NGL_DROPDOWN_DIRECTIVES = [
  NglDropdownDirective,
  NglDropdownTriggerDirective,
  NglDropdownItemDirective,
];


@NgModule({
  declarations: [NGL_DROPDOWN_DIRECTIVES],
  exports: [NGL_DROPDOWN_DIRECTIVES],
  imports: [CommonModule],
})
export class NglMenusModule {}
