import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NglIconsModule} from '../icons/module';

import {NglModal} from './modal';
import {NglModalFooterDirective} from './footer';
import {NglModalHeaderTemplate} from './header';

const NGL_MODAL_DIRECTIVES = [
  NglModal,
  NglModalFooterDirective,
  NglModalHeaderTemplate,
];

@NgModule({
  declarations: [NGL_MODAL_DIRECTIVES],
  exports: [NGL_MODAL_DIRECTIVES],
  imports: [CommonModule, NglIconsModule],
})
export class NglModalsModule {}
