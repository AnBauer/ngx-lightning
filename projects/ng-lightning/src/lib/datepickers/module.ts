import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NglIconsModule} from '../icons/module';

import {NglDatepickerComponent} from './datepicker';

import {NglDatepickerWeekdaysComponent} from './weekdays';
import {NglDayComponent} from './day';
import {NglDatepickerYearComponent} from './year';

@NgModule({
  declarations: [NglDatepickerComponent, NglDayComponent, NglDatepickerWeekdaysComponent, NglDatepickerYearComponent],
  exports: [NglDatepickerComponent],
  imports: [CommonModule, FormsModule, NglIconsModule],
})
export class NglDatepickersModule {}
