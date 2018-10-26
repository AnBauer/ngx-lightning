import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglRatingComponent} from './rating';
import {NglRatingIconTemplateDirective} from './icons';
import {NglIconsModule} from '../icons/module';

const DIRECTIVES = [
  NglRatingComponent,
  NglRatingIconTemplateDirective,
];

@NgModule({
  imports: [CommonModule, NglIconsModule],
  declarations: [ ...DIRECTIVES ],
  exports: [ ...DIRECTIVES ],
})
export class NglRatingsModule {}
