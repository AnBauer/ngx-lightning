import {TestBed, ComponentFixture, async}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent, selectElements, dispatchKeyEvent} from '../../test/util/helpers';
import {By} from '@angular/platform-browser';
import {NglLookupsModule} from './module';

const createTestComponent = (html?: string) =>
  createGenericTestComponent(TestComponent, html) as ComponentFixture<TestComponent>;

function getElements(element: HTMLElement) {
  return {
    lookup: <HTMLDivElement>element.querySelector('.slds-lookup'),
    label: <HTMLLabelElement>element.querySelector('label'),
    input: <HTMLInputElement>element.querySelector('input'),
    menu: <HTMLElement>element.querySelector('.slds-lookup__menu'),
    options: selectElements(element, '.slds-lookup__list > li'),
    pill: getPill(element),
  };
}

export function getPill(element: HTMLElement) {
  return <HTMLAnchorElement>element.querySelector('.slds-pill_container');
}

function clickRemove(element: HTMLElement) {
  const button = <HTMLButtonElement>element.querySelector('button');
  button.click();
}

function expectSearchIcon(element: HTMLElement, exists: boolean) {
  const containerEl = element.querySelector('.slds-input-has-icon');
  const svg = containerEl.querySelector('svg.slds-input__icon');
  if (exists) {
    expect(containerEl).toHaveCssClass('slds-input-has-icon--right');
    expect(svg).toBeTruthy();
  } else {
    expect(containerEl).not.toHaveCssClass('slds-input-has-icon--right');
    expect(svg).toBeFalsy();
  }
}

function expectOptions(fixture: any, expectedOptions: any[]) {
  fixture.detectChanges();
  const { options } = getElements(fixture.nativeElement);
  expect(options.map(e => e.textContent.trim())).toEqual(expectedOptions);
}

export function expectMenuExpanded(element: HTMLElement, isOpen: boolean) {
  const { lookup, menu, input } = getElements(element);

  if (isOpen) {
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(lookup).toHaveCssClass('slds-is-open');
    expect(menu).toBeTruthy();
  } else {
    if (input) {
      expect(input.getAttribute('aria-expanded')).toBe('false');
    }
    expect(lookup).not.toHaveCssClass('slds-is-open');
    expect(menu).toBeFalsy();
  }
}

describe('Lookup Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglLookupsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();

    const { label, input, options, pill } = getElements(fixture.nativeElement);
    expect(label.textContent.trim()).toEqual('Lookup:');
    expect(label.getAttribute('for')).toEqual(input.id);

    expect(input.value).toBe('');
    expect(input.placeholder).toBe('');
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(pill).toBeFalsy();

    expectMenuExpanded(fixture.nativeElement, false);
    expect(options.length).toBe(0);
  });

  it('should support custom label template', () => {
    const fixture = createTestComponent(`<ngl-lookup [lookup]="filter"><ng-template nglLookupLabel>Lookup:</ng-template></ngl-lookup>`);

    const { label, input } = getElements(fixture.nativeElement);
    expect(label.textContent.trim()).toEqual('Lookup:');
    expect(label.getAttribute('for')).toEqual(input.id);
  });

  it('should not render label if empty', () => {
    const fixture = createTestComponent(`<ngl-lookup label="" [lookup]="filter"></ngl-lookup>`);

    const { label } = getElements(fixture.nativeElement);
    expect(label).toBeNull();
  });

  it('should support custom header', () => {
    const fixture = createTestComponent(`
      <ngl-lookup [value]="value" [lookup]="filter" debounce="0">
        <div nglLookupHeader class="slds-text-body--small">Header</div>
      </ngl-lookup>`);

    fixture.componentInstance.value = 'DE';
    fixture.detectChanges();
    const { menu } = getElements(fixture.nativeElement);
    const headerEl = menu.firstElementChild;

    expect(headerEl).toHaveCssClass('slds-lookup__item--label');
    expect(headerEl).toHaveCssClass('slds-text-body--small');
    expect(headerEl.textContent).toBe('Header');
  });

  it('should update placeholder based on input', () => {
    const fixture = createTestComponent(`<ngl-lookup [lookup]="filter" [placeholder]="placeholder"></ngl-lookup>`);

    const { input } = getElements(fixture.nativeElement);
    expect(input.placeholder).toBe('');

    fixture.componentInstance.placeholder = 'my placeholder';
    fixture.detectChanges();
    expect(input.placeholder).toBe('my placeholder');
    expectSearchIcon(fixture.nativeElement, true);
  });

  it('should render search icon based on input', () => {
    const fixture = createTestComponent(`<ngl-lookup [searchIcon]="icon" debounce="0"></ngl-lookup>`);
    fixture.componentInstance.icon = false;
    fixture.detectChanges();
    expectSearchIcon(fixture.nativeElement, false);

    fixture.componentInstance.icon = true;
    fixture.detectChanges();
    expectSearchIcon(fixture.nativeElement, true);
  });

  it('should toggle pill and <input> based on input', () => {
    const fixture = createTestComponent(`<ngl-lookup [lookup]="filter" [pick]="selection"></ngl-lookup>`);

    function expectInputToExist(exists: boolean) {
      const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
      if (exists) {
        expect(inputEl).toBeTruthy();
      } else {
        expect(inputEl).toBeFalsy();
      }
      return inputEl;
    }

    expectInputToExist(true);
    expect(getPill(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.selection = 'my selection';
    fixture.detectChanges();

    expectInputToExist(false);
    expect(getPill(fixture.nativeElement).textContent.trim()).toBe('my selection');

    fixture.componentInstance.selection = null;
    fixture.detectChanges();
    const input = expectInputToExist(true);
    expect(input.value).toBe('');
    expect(getPill(fixture.nativeElement)).toBeFalsy();
  });

  it('should remove selection when clicking on pill button and focus input', () => {
    const fixture = createTestComponent(`<ngl-lookup [lookup]="filter" [(pick)]="selection"></ngl-lookup>`);
    fixture.componentInstance.selection = 'my selection';
    fixture.detectChanges();

    clickRemove(fixture.nativeElement);
    expect(fixture.componentInstance.selection).toBe(null);

    fixture.detectChanges();
    const { input } = getElements(fixture.nativeElement);
    expect(<Element>input).toBe(document.activeElement);
  });

  it('should close menu when there is selection', () => {
    const fixture = createTestComponent(`<ngl-lookup [value]="value" [lookup]="filter" [pick]="selection" debounce="0"></ngl-lookup>`);
    const { nativeElement, componentInstance } = fixture;

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, true);

    fixture.componentInstance.selection = 'my selection';
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, false);
  });

  it('should trigger lookup function when value changes', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;

    componentInstance.value = 'ABC';
    fixture.detectChanges();
    expect(componentInstance.filter).toHaveBeenCalledWith('ABC');

    componentInstance.value = 'ABCDE';
    fixture.detectChanges();
    expect(componentInstance.filter).toHaveBeenCalledWith('ABCDE');
  });

  it('should change suggestions based on lookup result', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectOptions(fixture, ['ABCDE', 'DEFGH']);

    componentInstance.value = 'DEF';
    fixture.detectChanges();
    expectOptions(fixture, ['DEFGH']);

    componentInstance.value = 'NO MATCH';
    fixture.detectChanges();
    expectOptions(fixture, ['No results found']);
  });

  it('should custom message when no results found', () => {
    const fixture = createTestComponent(
      `<ngl-lookup [value]="value" [lookup]="filter" [(pick)]="selection" debounce="0" noResultsText="Nothing found!"></ngl-lookup>`);
    const { componentInstance } = fixture;

    componentInstance.value = 'NO MATCH';
    fixture.detectChanges();
    expectOptions(fixture, ['Nothing found!']);
  });

  it('should update input with selection and close menu', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectOptions(fixture, ['ABCDE', 'DEFGH']);

    const { options } = getElements(nativeElement);
    options[1].click();
    expect(componentInstance.onSelect).toHaveBeenCalledWith('DEFGH');
  });

  it('should close menu on escape key', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;

    expectMenuExpanded(nativeElement, false);

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, true);

    dispatchKeyEvent(fixture, By.css('input'), 'keydown.Esc');
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, false);
  });

  it('should close menu on outside click', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;

    const { input } = getElements(nativeElement);

    expectMenuExpanded(nativeElement, false);

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, true);

    input.click();
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, true);

    document.body.click();
    fixture.detectChanges();
    expectMenuExpanded(nativeElement, false);
  });

  it('should handle objects using `field` property', () => {
    const fixture = createTestComponent(`<ngl-lookup [value]="value" [lookup]="filterObject" field="name" (pickChange)="onSelect($event)" debounce="0"></ngl-lookup>`);
    const { nativeElement, componentInstance } = fixture;
    fixture.detectChanges();

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectOptions(fixture, ['ABCDE', 'DEFGH']);

    const { options } = getElements(nativeElement);
    options[1].click();
    expect(componentInstance.onSelect).toHaveBeenCalledWith({id: 2, name: 'DEFGH'});
  });

  it('should support keyboard navigation and selection', async(() => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;

    const { input } = getElements(nativeElement);

    function expectActiveOption(keyEvent: string, option: HTMLElement = null) {
      dispatchKeyEvent(fixture, By.css('input'), `keydown.${keyEvent}`);
      fixture.detectChanges();

      return fixture.whenStable().then(() => {
        if (option) {
          expect(input.getAttribute('aria-activedescendant')).toBe(option.children[0].id);
          expect(input.value).toBe(option.children[0].textContent);
        } else {
          expect(input.getAttribute('aria-activedescendant')).toBeNull();
        }
      });
    }

    expect(input.getAttribute('aria-activedescendant')).toBeNull();

    componentInstance.value = 'DE';
    fixture.detectChanges();
    expectOptions(fixture, ['ABCDE', 'DEFGH']);

    const { options } = getElements(nativeElement);

    expectActiveOption('ArrowDown', options[0]).then(() => {
      return expectActiveOption('ArrowDown', options[1]);
    }).then(() => {
      return expectActiveOption('ArrowDown', options[1]);
    }).then(() => {
      return expectActiveOption('ArrowUp', options[0]);
    }).then(() => {
      return expectActiveOption('ArrowUp', null);
    }).then(() => {
      return expectActiveOption('ArrowUp', null);
    }).then(() => {
      dispatchKeyEvent(fixture, By.css('input'), `keydown.Enter`);
      expect(componentInstance.onSelect).not.toHaveBeenCalled();
      return expectActiveOption('ArrowDown', options[0]);
    }).then(() => {
      dispatchKeyEvent(fixture, By.css('input'), `keydown.Enter`);
      expect(componentInstance.onSelect).toHaveBeenCalledWith('ABCDE');
    });
  }));

  it('should support custom item template', () => {
    const fixture = createTestComponent(`<ngl-lookup [value]="value" [lookup]="filter" [pick]="selection" (pickChange)="onSelect($event)" debounce="0">
          <ng-template nglLookupLabel>Lookup:</ng-template>
          <ng-template nglLookupItem let-ctx>{{ctx.foo}} - {{ctx.bar}} {{value}}</ng-template>
        </ngl-lookup>`);
    const { componentInstance, nativeElement } = fixture;
    componentInstance.filter = jasmine.createSpy('filter').and.callFake(() => [
      { foo: 'foo_1', bar: 'bar_1' },
      { foo: 'foo_2', bar: 'bar_2' },
    ]);
    fixture.detectChanges();

    componentInstance.value = 'DE';
    fixture.detectChanges();

    const { options } = getElements(nativeElement);
    expect(options[0]).toHaveText('foo_1 - bar_1 DE');
    expect(options[1]).toHaveText('foo_2 - bar_2 DE');
  });
});

@Component({
  template: `
    <ngl-lookup label="Lookup:" [value]="value" [lookup]="filter" [pick]="selection" (pickChange)="onSelect($event)" debounce="0"></ngl-lookup>`,
})
export class TestComponent {

  selection: any;
  icon: boolean;
  value = '';
  placeholder: string;

  filter = jasmine.createSpy('filter').and.callFake((value: string) => {
    const data = ['ABCDE', 'DEFGH', 'EHIJ'];
    return data.filter((d: string) => d.indexOf(value) > -1);
  });

  onSelect = jasmine.createSpy('onSelect').and.callFake((selection: any) => {
    this.selection = selection;
  });

  filterObject(value: string) {
    const data = [
      {id: 1, name: 'ABCDE'},
      {id: 2, name: 'DEFGH'},
      {id: 3, name: 'EHIJ'},
    ];
    return data.filter((d: any) => d.name.indexOf(value) > -1);
  }
}
