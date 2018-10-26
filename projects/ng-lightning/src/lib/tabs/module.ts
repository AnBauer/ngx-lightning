import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglTabsComponent} from './tabs';
import {NglTabDirective} from './tab';
import {NglTabVerbose, NglTabContent, NglTabHeading} from './tab-verbose';
import {NglInternalOutletModule} from '../util/outlet.module';

const NGL_TAB_DIRECTIVES = [
  NglTabsComponent,
  NglTabDirective,
  NglTabVerbose, NglTabContent, NglTabHeading,
];

@NgModule({
  declarations: [NGL_TAB_DIRECTIVES],
  exports: [NGL_TAB_DIRECTIVES],
  imports: [CommonModule, NglInternalOutletModule],
})
export class NglTabsModule {}
