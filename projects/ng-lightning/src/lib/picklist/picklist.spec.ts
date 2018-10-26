import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent, selectElements} from '../../test/util/helpers';
import {NglPicklistModule} from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function isOpen(fixture: ComponentFixture<TestComponent>) {
  return fixture.nativeElement.querySelector('.slds-picklist').classList.contains('slds-is-open');
}

function getDropdownTrigger(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

export function getOptionElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'li');
}

function expectOptions(element: HTMLElement, expected: any[]) {
  const options = getOptionElements(element);

  expect(options.map(e => e.textContent.trim()).map((text, i) => {
    return options[i].classList.contains('slds-is-selected') ? `+${text}` : text;
  })).toEqual(expected);
}

describe('`NglPicklist`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPicklistModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();

    expect(isOpen(fixture)).toBe(false);

    const trigger = getDropdownTrigger(fixture.nativeElement);
    expect(trigger.textContent.trim()).toBe('Select option(s)');

    expectOptions(fixture.nativeElement, [ 'Item 1', 'Item 2', 'Item 3' ]);
  });

  it('should open based on input', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    expect(isOpen(fixture)).toBe(true);

    fixture.componentInstance.open = false;
    fixture.detectChanges();
    expect(isOpen(fixture)).toBe(false);
  });

  it('should render selected items', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;
    componentInstance.picks = [ componentInstance.items[0], componentInstance.items[2] ];
    fixture.detectChanges();

    expectOptions(fixture.nativeElement, [ '+Item 1', 'Item 2', '+Item 3' ]);

    componentInstance.picks = [ componentInstance.items[1] ];
    fixture.detectChanges();
    expectOptions(fixture.nativeElement, [ 'Item 1', '+Item 2', 'Item 3' ]);
  });

  it('should toggle option selection', () => {
    const fixture = createTestComponent();
    const { componentInstance, nativeElement } = fixture;
    componentInstance.open = true;
    componentInstance.picks = [ componentInstance.items[0], componentInstance.items[2] ];
    fixture.detectChanges();

    const options = getOptionElements(nativeElement);

    options[0].click();
    fixture.detectChanges();
    expectOptions(fixture.nativeElement, [ 'Item 1', 'Item 2', '+Item 3' ]);

    options[1].click();
    fixture.detectChanges();
    expectOptions(fixture.nativeElement, [ 'Item 1', '+Item 2', '+Item 3' ]);

    expect(isOpen(fixture)).toBe(true);
  });

  it('should toggle option selection and close when not multiple', () => {
    const fixture = createTestComponent(null, false);
    const { componentInstance, nativeElement } = fixture;
    componentInstance.open = true;
    componentInstance.multiple = false;
    componentInstance.picks = componentInstance.items[0];
    fixture.detectChanges();

    expectOptions(fixture.nativeElement, [ '+Item 1', 'Item 2', 'Item 3' ]);

    const options = getOptionElements(nativeElement);
    options[1].click();
    fixture.detectChanges();
    expectOptions(fixture.nativeElement, [ 'Item 1', '+Item 2', 'Item 3' ]);
    expect(isOpen(fixture)).toBe(false);
  });

  it('should render trigger disabled', () => {
    const fixture = createTestComponent(`
      <ngl-picklist [data]="items" [(nglPick)]="picks" [disabled]="disabled">
        <ng-template nglPicklistItem let-item>{{item.value}}</ng-template>
      </ngl-picklist>
    `);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const triggerEl = getDropdownTrigger(fixture.nativeElement);
    expect(triggerEl.disabled).toBe(true);

    fixture.componentInstance.disabled = false;
    fixture.detectChanges();
    expect(triggerEl.disabled).toBe(false);
  });

  it('should render as fluid', () => {
    const fixture = createTestComponent(`
      <ngl-picklist [data]="items" [(nglPick)]="picks" [fluid]="fluid">
        <ng-template nglPicklistItem let-item>{{item.value}}</ng-template>
      </ngl-picklist>`);
    fixture.componentInstance.fluid = true;
    fixture.detectChanges();

    const picklistEl = fixture.nativeElement.querySelector('.slds-picklist');
    expect(picklistEl).toHaveCssClass('slds-picklist--fluid');

    fixture.componentInstance.fluid = false;
    fixture.detectChanges();
    expect(picklistEl).not.toHaveCssClass('slds-picklist--fluid');
  });
});


@Component({
  template: `
    <ngl-picklist [data]="items" [(nglPick)]="picks" [(open)]="open" [nglPickMultiple]="multiple">
      <span class="slds-truncate">{{picks.length ? picks.length + ' options selected' : 'Select option(s)'}}</span>
      <ng-template nglPicklistItem let-item>{{item.value}}</ng-template>
    </ngl-picklist>
  `,
})
export class TestComponent {
  open: boolean;
  multiple: boolean = true;
  disabled: boolean;
  fluid: boolean;
  picks: any = [];

  items = [
    { value: 'Item 1', icon: 'kanban' },
    { value: 'Item 2', icon: 'side_list' },
    { value: 'Item 3', icon: 'table' },
  ];
}
