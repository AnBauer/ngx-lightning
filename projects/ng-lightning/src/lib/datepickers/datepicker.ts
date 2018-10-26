import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { uniqueId, toBoolean } from '../util/util';

export interface NglInternalDate {
  year: number;
  month: number;
  day: number;
  disabled?: boolean;
}

@Component({
  selector       : 'ngl-datepicker',
  templateUrl    : './datepicker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host           : {
    'aria-hidden'            : 'false',
    '[class.slds-datepicker]': 'true',
    'tabindex'               : '0'
  },
  styles         : [
      `:host {
      display: block;
    }`
  ]
})
export class NglDatepickerComponent {
  @Input() monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  @Input() dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  @Input() dayNamesLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursda', 'Friday', 'Saturday'];

  date: NglInternalDate;
  current: NglInternalDate;

  @Input('date') set _date(date: Date) {
    this.date = this.parseDate(date);
    if (this.date) {
      this.current = Object.assign({}, this.date);
    }
    this.render();
  }

  @Output() dateChange = new EventEmitter();

  showToday = true;

  @Input('showToday') set _showToday(showToday: boolean) {
    this.showToday = toBoolean(showToday);
  }

  firstDayOfWeek = 0;

  @Input('firstDayOfWeek') set _firstDayOfWeek(firstDayOfWeek: number) {
    this.firstDayOfWeek = +firstDayOfWeek;
    this.render();
  }

  weeks: NglInternalDate[];
  uid = uniqueId('datepicker');
  monthLabel: string;

  moveYear(year: string | number) {
    this.current.year = +year;
    this.render();
  }

  @HostListener('keydown.Enter', ['$event', '"Enter"'])
  @HostListener('keydown.ArrowUp', ['$event', '"Move"', '-7'])
  @HostListener('keydown.ArrowLeft', ['$event', '"Move"', '-1'])
  @HostListener('keydown.ArrowDown', ['$event', '"Move"', '7'])
  @HostListener('keydown.ArrowRight', ['$event', '"Move"', '1'])
  @HostListener('keydown.PageUp', ['$event', '"MoveMonth"', '-1'])
  @HostListener('keydown.PageDown', ['$event', '"MoveMonth"', '1'])
  @HostListener('keydown.Home', ['$event', '"MoveTo"', '1'])
  @HostListener('keydown.End', ['$event', '"MoveTo"', '31'])
  keyboardHandler($event: KeyboardEvent, code: string, param?: number | string) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    if (code === 'Enter') {
      this.select();
      return;
    }

    // Change current date
    const {year, month, day} = this.current;
    const date = new Date(year, month, day, 12);

    if (code === 'Move') {
      date.setDate(day + (+param));
      this.current = {year: date.getFullYear(), month: date.getMonth(), day: date.getDate()};
    } else if (code === 'MoveMonth') {
      date.setMonth(month + (+param), 1);
      this.current = {year: date.getFullYear(), month: date.getMonth(), day};
    } else if (code === 'MoveTo') {
      this.current.day = +param;
    }
    this.render();
  }

  isSelected(date: NglInternalDate) {
    return this.isEqualDate(date, this.date);
  }

  isActive(date: NglInternalDate) {
    return this.isEqualDate(date, this.current);
  }

  select(date: NglInternalDate = this.current) {
    if (date.disabled) {
      return;
    }

    const {year, month, day} = date;
    this.dateChange.emit(new Date(year, month, day));
  }

  indexTrackBy(index: number) {
    return index;
  }

  selectToday() {
    this.dateChange.emit(new Date());
  }

  private parseDate(date: Date): NglInternalDate {
    if (!date) {
      return null;
    }

    return {year: date.getFullYear(), month: date.getMonth(), day: date.getDate()};
  }

  private isEqualDate(d1: NglInternalDate, d2: NglInternalDate) {
    return d1 && d2 && d1.day === d2.day && d1.month === d2.month && d1.year === d2.year;
  }

  private render() {
    if (!this.current) {
      this.current = this.today;
    }

    const {year, month, day} = this.current;
    this.monthLabel = this.monthNames[month];

    const days = this.daysInMonth(year, month);

    // Keep current day inside limits of this month
    this.current.day = Math.min(day, days.length);

    Array.prototype.unshift.apply(days, this.daysInPreviousMonth(year, month));
    const nextMonth = this.daysInNextMonth(year, month + 1, days.length);
    if (nextMonth) {
      Array.prototype.push.apply(days, nextMonth);
    }

    this.weeks = this.split(days);
  }

  private daysInMonth(year: number, month: number) {
    const last = new Date(year, month + 1, 0).getDate();
    return this.getDayObjects(year, month, 1, last);
  }

  private daysInPreviousMonth(year: number, month: number) {
    const firstIndex = (new Date(year, month, 1)).getDay();
    const last = new Date(year, month, 0).getDate();
    const numDays = (7 + firstIndex - this.firstDayOfWeek) % 7;

    return this.getDayObjects(year, month - 1, last - numDays + 1, last, true);
  }

  private daysInNextMonth(year: number, month: number, numOfDays: number) {
    if (numOfDays % 7 === 0) {
      return;
    }

    return this.getDayObjects(year, month, 1, 7 - (numOfDays % 7), true);
  }

  private getDayObjects(year: number, month: number, from: number, to: number, disabled = false) {
    const days: NglInternalDate[] = [];
    for (let day = from; day <= to; day++) {
      days.push({year, month, day, disabled});
    }
    return days;
  }

  private get today() {
    const today = new Date();
    return {year: today.getFullYear(), month: today.getMonth(), day: today.getDate()};
  }

  // Split array into smaller arrays
  private split = function (arr: any[], size = 7) {
    const arrays: any[] = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  };
}
