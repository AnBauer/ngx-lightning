import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NglIconsModule} from '../icons/module';
import {NglPillsModule} from '../pills/module';
import {NglMenusModule} from '../menus/module';
import {NglInternalOutletModule} from '../util/outlet.module';

import {NglLookupComponent} from './lookup';
import {NglLookupItemTemplateDirective, NglLookupLabelTemplateDirective, NglLookupHeaderDirective} from './item';
import {NglLookupScopeItem} from './scope-item';

import {NglInternalLookupScopeComponent} from './scope';

const NGL_LOOKUP_DIRECTIVES = [
  NglLookupComponent,
  NglLookupItemTemplateDirective,
  NglLookupScopeItem,
  NglLookupLabelTemplateDirective,
  NglLookupHeaderDirective,
];

@NgModule({
  declarations: [NGL_LOOKUP_DIRECTIVES, NglInternalLookupScopeComponent],
  exports: [NGL_LOOKUP_DIRECTIVES],
  imports: [CommonModule, FormsModule, NglIconsModule, NglPillsModule, NglMenusModule, NglInternalOutletModule],
})
export class NglLookupsModule {}
