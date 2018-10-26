import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglIconComponent} from './icon';
import {NglIconSvgComponent} from './svg';
import {NglIconWaffleComponent} from './waffle';

const NGL_ICON_DIRECTIVES = [
  NglIconComponent,
  NglIconSvgComponent,
  NglIconWaffleComponent,
];

@NgModule({
  declarations: NGL_ICON_DIRECTIVES,
  exports: NGL_ICON_DIRECTIVES,
  imports: [CommonModule],
})
export class NglIconsModule {}
