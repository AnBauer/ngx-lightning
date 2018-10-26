import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglPopoverComponent} from './popover';
import {NglPopoverTriggerDirective} from './trigger';
import {NglPopoverBehaviorDirective} from './behavior';

const NGL_POPOVER_DIRECTIVES = [
  NglPopoverComponent,
  NglPopoverTriggerDirective,
  NglPopoverBehaviorDirective,
];

@NgModule({
  declarations: [NGL_POPOVER_DIRECTIVES],
  exports: [NGL_POPOVER_DIRECTIVES],
  imports: [CommonModule],
  entryComponents: [NglPopoverComponent],
})
export class NglPopoversModule {}
