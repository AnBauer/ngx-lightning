import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglSectionComponent} from './section';
import {NglIconsModule} from '../icons/module';

@NgModule({
  declarations: [NglSectionComponent],
  exports: [NglSectionComponent],
  imports: [CommonModule, NglIconsModule],
})
export class NglSectionsModule {}
