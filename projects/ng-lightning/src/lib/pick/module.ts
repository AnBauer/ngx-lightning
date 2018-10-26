import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglPickDirective} from './pick';
import {NglPickOptionDirective} from './pick-option';

const NGL_PICK_DIRECTIVES = [
  NglPickDirective,
  NglPickOptionDirective,
];

@NgModule({
  declarations: [NGL_PICK_DIRECTIVES],
  exports: [NGL_PICK_DIRECTIVES],
  imports: [CommonModule],
})
export class NglPickModule {}
