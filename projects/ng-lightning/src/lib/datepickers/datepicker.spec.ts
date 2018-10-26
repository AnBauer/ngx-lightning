import {TestBed, ComponentFixture, async}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent, selectElements, dispatchEvent, dispatchKeyEvent} from '../../test/util/helpers';
import {By} from '@angular/platform-browser';
import {NglDatepickersModule} from './module';
import {NglDatepickerComponent} from './datepicker';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

// Microsoft Edge hack
function removeNonPrintable(str: string) {
  return str.replace(/[^\x20-\x7E]+/g, '');
}

function getDayElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, '.slds-day');
}

function getDayHeaders(element: HTMLElement) {
  return selectElements(element, 'th').map(e => e.textContent.trim()).map(removeNonPrintable);
}

function getYearOptions(element: HTMLElement) {
  return selectElements(element, 'option');
}

function buildArray(start: number, end: number) {
  const arr: string[] = [];
  while (start <= end) {
    arr.push(start++ + '');
  }
  return arr;
}

function chooseYear(element: HTMLElement, year: number) {
  const select = <HTMLSelectElement>element.querySelector('select');
  select.value = '' + year;

  dispatchEvent(select, 'change', false);
}

function clickButton(element: HTMLElement, isNext = false) {
  const buttons = selectElements(element, 'button');
  buttons[+isNext].click();
}

function dispatchKey(fixture: ComponentFixture<any>, key: string) {
  dispatchKeyEvent(fixture, By.directive(NglDatepickerComponent), `keydown.${key}`);
  fixture.detectChanges();
}

function getTableRows(element: HTMLElement) {
  return selectElements(element, 'tbody > tr');
}

function expectCalendar(fixture: ComponentFixture<TestComponent>, expectedDates: any[], expectedMonth: string, expectedYear: string) {
  const element = fixture.nativeElement;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    const dates = getTableRows(element).map((trElement: HTMLElement, row: number) => {
      return selectElements(trElement, 'td').map((td: HTMLElement, column: number) => {
        let text = td.textContent.trim();
        if (td.classList.contains('slds-is-selected')) {
          text = '*' + text;
        }
        if (td.classList.contains('slds-is-today')) {
          text += '+';
        }
        if (td.classList.contains('slds-disabled-text')) {
          text += '-';
        }
        return text;
      });
    });
    expect(dates).toEqual(expectedDates);

    const month = removeNonPrintable(element.querySelector('h2.slds-align-middle').textContent.trim());
    expect(expectedMonth).toEqual(month);

    const year = (<HTMLSelectElement>element.querySelector('select.slds-select')).value;
    expect(expectedYear).toEqual(year);
  });
}

function expectYearOptions(element: HTMLElement, expectedYears: any[]) {
  expect(getYearOptions(element).map((e: HTMLOptionElement) => e.value)).toEqual(expectedYears);
}

describe('`Datepicker` Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglDatepickersModule]}));

  it('should render correctly', async(() => {
    const currentDate = new Date(2005, 10, 9); // 9 November 2005
    jasmine.clock().mockDate(currentDate);

    const fixture = createTestComponent();

    expectCalendar(fixture, [
      ['29-', '30-', '31-', '01', '02', '03', '04'],
      ['05', '06', '07', '08', '09', '10', '11'],
      ['12', '13', '14', '15', '16', '17', '18'],
      ['19', '20', '21', '22', '23', '24', '25'],
      ['26', '27', '28', '29', '*30+', '01-', '02-'],
    ], 'September', '2010').then(() => {
      expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]);
      expectYearOptions(fixture.nativeElement, buildArray(1905, 2015));
    });
  }));

  it('should change view when input date is changing', async(() => {
    const fixture = createTestComponent();

    fixture.componentInstance.date = new Date(2013, 7, 11); // 11 August 2013
    expectCalendar(fixture, [
      [ '28-', '29-', '30-', '31-', '01', '02', '03' ],
      [ '04', '05', '06', '07', '08', '09', '10' ],
      [ '*11+', '12', '13', '14', '15', '16', '17' ],
      [ '18', '19', '20', '21', '22', '23', '24' ],
      [ '25', '26', '27', '28', '29', '30', '31' ],
    ], 'August', '2013').then(() => {

      fixture.componentInstance.date = new Date(2014, 9, 23); // 23 October 2014
      expectCalendar(fixture, [
        [ '28-', '29-', '30-', '01', '02', '03', '04' ],
        [ '05', '06', '07', '08', '09', '10', '11' ],
        [ '12', '13', '14', '15', '16', '17', '18' ],
        [ '19', '20', '21', '22', '*23+', '24', '25' ],
        [ '26', '27', '28', '29', '30', '31', '01-' ],
      ], 'October', '2014');
    });
  }));

  it('does not change current view when model is cleared', async(() => {
    const fixture = createTestComponent();

    fixture.componentInstance.date = null;
    expectCalendar(fixture, [
      ['29-', '30-', '31-', '01', '02', '03', '04'],
      ['05', '06', '07', '08', '09', '10', '11'],
      ['12', '13', '14', '15', '16', '17', '18'],
      ['19', '20', '21', '22', '23', '24', '25'],
      ['26', '27', '28', '29', '30+', '01-', '02-'],
    ], 'September', '2010');
  }));

  it('should show current date if none is set', async(() => {
    const currentDate = new Date(2013, 7, 11); // 11 August 2013
    jasmine.clock().mockDate(currentDate);

    const fixture = createTestComponent(null, false);
    fixture.componentInstance.date = null;
    expectCalendar(fixture, [
      ['28-', '29-', '30-', '31-', '01', '02', '03'],
      ['04', '05', '06', '07', '08', '09', '10'],
      ['11+', '12', '13', '14', '15', '16', '17'],
      ['18', '19', '20', '21', '22', '23', '24'],
      ['25', '26', '27', '28', '29', '30', '31'],
    ], 'August', '2013');
  }));

  it('updates the model when a day is clicked', () => {
    const fixture = createTestComponent();
    const days = getDayElements(fixture.nativeElement);
    days[25].click();
    expect(fixture.componentInstance.dateChange).toHaveBeenCalledWith(new Date(2010, 8, 23));
  });

  it('do nothing when a disabled day is clicked', () => {
    const fixture = createTestComponent();
    const days = getDayElements(fixture.nativeElement);
    days[1].click();
    expect(fixture.componentInstance.dateChange).not.toHaveBeenCalled();
  });

  it('moves to previous month correctly when button is clicked', async(() => {
    const fixture = createTestComponent();
    clickButton(fixture.nativeElement, false);

    expectCalendar(fixture, [
      ['01', '02', '03', '04', '05', '06', '07'],
      ['08', '09', '10', '11', '12', '13', '14'],
      ['15', '16', '17', '18', '19', '20', '21'],
      ['22', '23', '24', '25', '26', '27', '28'],
      ['29', '30+', '31', '01-', '02-', '03-', '04-'],
    ], 'August', '2010').then(() => {
      expect(fixture.componentInstance.dateChange).not.toHaveBeenCalled();
    });
  }));

  it('moves to next month correctly when button is clicked', async(() => {
    const fixture = createTestComponent();
    clickButton(fixture.nativeElement, true);

    expectCalendar(fixture, [
      ['26-', '27-', '28-', '29-', '*30-', '01', '02'],
      ['03', '04', '05', '06', '07', '08', '09'],
      ['10', '11', '12', '13', '14', '15', '16'],
      ['17', '18', '19', '20', '21', '22', '23'],
      ['24', '25', '26', '27', '28', '29', '30+'],
      ['31', '01-', '02-', '03-', '04-', '05-', '06-'],
    ], 'October', '2010').then(() => {
      expect(fixture.componentInstance.dateChange).not.toHaveBeenCalled();
    });
  }));

  it('should not "jump" months and keep current day in limits', async(() => {
    const fixture = createTestComponent();
    fixture.componentInstance.date = new Date(2016, 0, 30);
    fixture.detectChanges();
    clickButton(fixture.nativeElement, true);

    expectCalendar(fixture, [
      [ '31-', '01', '02', '03', '04', '05', '06' ],
      [ '07', '08', '09', '10', '11', '12', '13' ],
      [ '14', '15', '16', '17', '18', '19', '20' ],
      [ '21', '22', '23', '24', '25', '26', '27' ],
      [ '28', '29+', '01-', '02-', '03-', '04-', '05-' ],
    ], 'February', '2016');
  }));

  it('moves to selected year from dropdown', async(() => {
    const fixture = createTestComponent();

    fixture.whenStable().then(() => {
      chooseYear(fixture.nativeElement, 2014);
      expectCalendar(fixture, [
        [ '31-', '01', '02', '03', '04', '05', '06' ],
        [ '07', '08', '09', '10', '11', '12', '13' ],
        [ '14', '15', '16', '17', '18', '19', '20' ],
        [ '21', '22', '23', '24', '25', '26', '27' ],
        [ '28', '29', '30+', '01-', '02-', '03-', '04-' ],
      ], 'September', '2014');
    });
  }));

  it('should change year range based on selection', () => {
    const currentDate = new Date(1983, 10, 7); // 7 November 1983
    jasmine.clock().mockDate(currentDate);

    const fixture = createTestComponent();
    expectYearOptions(fixture.nativeElement, buildArray(1883, 2010));
  });

  describe('keyboard navigation', () => {

    it('will be able to activate appropriate day', async(() => {
      const fixture = createTestComponent();

      dispatchKey(fixture, 'ArrowDown');
      expectCalendar(fixture, [
        ['26-', '27-', '28-', '29-', '*30-', '01', '02'],
        ['03', '04', '05', '06', '07+', '08', '09'],
        ['10', '11', '12', '13', '14', '15', '16'],
        ['17', '18', '19', '20', '21', '22', '23'],
        ['24', '25', '26', '27', '28', '29', '30'],
        ['31', '01-', '02-', '03-', '04-', '05-', '06-'],
      ], 'October', '2010').then(() => {

        dispatchKey(fixture, 'ArrowLeft');
        dispatchKey(fixture, 'ArrowLeft');
        return expectCalendar(fixture, [
          ['26-', '27-', '28-', '29-', '*30-', '01', '02'],
          ['03', '04', '05+', '06', '07', '08', '09'],
          ['10', '11', '12', '13', '14', '15', '16'],
          ['17', '18', '19', '20', '21', '22', '23'],
          ['24', '25', '26', '27', '28', '29', '30'],
          ['31', '01-', '02-', '03-', '04-', '05-', '06-'],
        ], 'October', '2010');
      }).then(() => {

        dispatchKey(fixture, 'ArrowUp');
        return expectCalendar(fixture, [
          ['29-', '30-', '31-', '01', '02', '03', '04'],
          ['05', '06', '07', '08', '09', '10', '11'],
          ['12', '13', '14', '15', '16', '17', '18'],
          ['19', '20', '21', '22', '23', '24', '25'],
          ['26', '27', '28+', '29', '*30', '01-', '02-'],
        ], 'September', '2010');
      }).then(() => {

        dispatchKey(fixture, 'ArrowRight');
        return expectCalendar(fixture, [
          ['29-', '30-', '31-', '01', '02', '03', '04'],
          ['05', '06', '07', '08', '09', '10', '11'],
          ['12', '13', '14', '15', '16', '17', '18'],
          ['19', '20', '21', '22', '23', '24', '25'],
          ['26', '27', '28', '29+', '*30', '01-', '02-'],
        ], 'September', '2010');
      });
    }));

    it('will be able to activate appropriate edge day', async(() => {
      const fixture = createTestComponent();

      dispatchKey(fixture, 'Home');
      expectCalendar(fixture, [
        ['29-', '30-', '31-', '01+', '02', '03', '04'],
        ['05', '06', '07', '08', '09', '10', '11'],
        ['12', '13', '14', '15', '16', '17', '18'],
        ['19', '20', '21', '22', '23', '24', '25'],
        ['26', '27', '28', '29', '*30', '01-', '02-'],
      ], 'September', '2010').then(() => {

        dispatchKey(fixture, 'End');
        return expectCalendar(fixture, [
          ['29-', '30-', '31-', '01', '02', '03', '04'],
          ['05', '06', '07', '08', '09', '10', '11'],
          ['12', '13', '14', '15', '16', '17', '18'],
          ['19', '20', '21', '22', '23', '24', '25'],
          ['26', '27', '28', '29', '*30+', '01-', '02-'],
        ], 'September', '2010');
      });
    }));

    it('will be able to select active day', () => {
      const fixture = createTestComponent();

      dispatchKey(fixture, 'ArrowDown');
      dispatchKey(fixture, 'ArrowLeft');
      dispatchKey(fixture, 'ArrowLeft');
      expect(fixture.componentInstance.dateChange).not.toHaveBeenCalled();
      dispatchKey(fixture, 'Enter');
      expect(fixture.componentInstance.dateChange).toHaveBeenCalledWith(new Date(2010, 9, 5));
    });
  });

  it('should render `Today` based on input', () => {
    const currentDate = new Date(2014, 9, 23); // 23 October 2014
    jasmine.clock().mockDate(currentDate);

    const fixture = createTestComponent(`<ngl-datepicker [date]="date" (dateChange)="dateChange($event)" [showToday]="showToday"></ngl-datepicker>`);
    fixture.componentInstance.showToday = true;
    fixture.detectChanges();
    let rows = getTableRows(fixture.nativeElement);
    expect(rows.length).toBe(6);

    const todayEl = <HTMLAnchorElement>rows[5].querySelector('a');
    expect(fixture.componentInstance.dateChange).not.toHaveBeenCalled();
    todayEl.click();
    expect(fixture.componentInstance.dateChange).toHaveBeenCalledWith(currentDate);

    fixture.componentInstance.showToday = false;
    fixture.detectChanges();
    expect(getTableRows(fixture.nativeElement).length).toBe(5);
  });

  it('should support custom month and day names', async(() => {
    const currentDate = new Date(2005, 10, 9); // 9 November 2005
    jasmine.clock().mockDate(currentDate);

    const fixture = createTestComponent(`<ngl-datepicker [date]="date" [monthNames]="customMonths" [dayNamesShort]="customDays" showToday="false"></ngl-datepicker>`);
    expectCalendar(fixture, [
      ['29-', '30-', '31-', '01', '02', '03', '04'],
      ['05', '06', '07', '08', '09', '10', '11'],
      ['12', '13', '14', '15', '16', '17', '18'],
      ['19', '20', '21', '22', '23', '24', '25'],
      ['26', '27', '28', '29', '*30+', '01-', '02-'],
    ], 'Sep', '2010').then(() => {
      expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7' ]);
    });
  }));

  it('should support custom week start', async(() => {
    const fixture = createTestComponent(`<ngl-datepicker [date]="date" [firstDayOfWeek]="firstDayOfWeek" showToday="false"></ngl-datepicker>`);

    expectCalendar(fixture, [
      ['30-', '31-', '01', '02', '03', '04', '05'],
      ['06', '07', '08', '09', '10', '11', '12'],
      ['13', '14', '15', '16', '17', '18', '19'],
      ['20', '21', '22', '23', '24', '25', '26'],
      ['27', '28', '29', '*30+', '01-', '02-', '03-'],
    ], 'September', '2010').then(() => {
      expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]);

      fixture.componentInstance.firstDayOfWeek = 2;
      expectCalendar(fixture, [
        ['31-', '01', '02', '03', '04', '05', '06'],
        ['07', '08', '09', '10', '11', '12', '13'],
        ['14', '15', '16', '17', '18', '19', '20'],
        ['21', '22', '23', '24', '25', '26', '27'],
        ['28', '29', '*30+', '01-', '02-', '03-', '04-'],
      ], 'September', '2010').then(() => {
        expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon' ]);
      });
    });
  }));

  it('should handle `firstDayOfWeek` as string attribute', async(() => {
    const fixture = createTestComponent(`<ngl-datepicker [date]="date" firstDayOfWeek="1" showToday="false"></ngl-datepicker>`);

    expectCalendar(fixture, [
      ['30-', '31-', '01', '02', '03', '04', '05'],
      ['06', '07', '08', '09', '10', '11', '12'],
      ['13', '14', '15', '16', '17', '18', '19'],
      ['20', '21', '22', '23', '24', '25', '26'],
      ['27', '28', '29', '*30+', '01-', '02-', '03-'],
    ], 'September', '2010').then(() => {
      expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]);
    });
  }));

  it('should handle when first day of week is after first day of month', async(() => {
    const fixture = createTestComponent(`<ngl-datepicker [date]="date" [firstDayOfWeek]="firstDayOfWeek" showToday="false"></ngl-datepicker>`, false);

    fixture.componentInstance.firstDayOfWeek = 3;
    expectCalendar(fixture, [
      ['01', '02', '03', '04', '05', '06', '07'],
      ['08', '09', '10', '11', '12', '13', '14'],
      ['15', '16', '17', '18', '19', '20', '21'],
      ['22', '23', '24', '25', '26', '27', '28'],
      ['29', '*30+', '01-', '02-', '03-', '04-', '05-'],
    ], 'September', '2010').then(() => {
      expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue' ]);

      fixture.componentInstance.firstDayOfWeek = 4;
      expectCalendar(fixture, [
        ['26-', '27-', '28-', '29-', '30-', '31-', '01'],
        ['02', '03', '04', '05', '06', '07', '08'],
        ['09', '10', '11', '12', '13', '14', '15'],
        ['16', '17', '18', '19', '20', '21', '22'],
        ['23', '24', '25', '26', '27', '28', '29'],
        ['*30+', '01-', '02-', '03-', '04-', '05-', '06-'],
      ], 'September', '2010').then(() => {
        expect(getDayHeaders(fixture.nativeElement)).toEqual([ 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed' ]);
      });
    });
  }));
});


@Component({
  template: `<ngl-datepicker [date]="date" (dateChange)="dateChange($event)" showToday="false"></ngl-datepicker>`,
})
export class TestComponent {
  date = new Date(2010, 8, 30); // 30 September 2010
  showToday: boolean;
  dateChange = jasmine.createSpy('dateChange');
  firstDayOfWeek = 1;

  customMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  customDays = [ 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7' ];
}
