import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent, selectElements} from '../../test/util/helpers';
import {NglLookupsModule} from './module';
import {expectMenuExpanded, getPill} from './lookup.spec';

const createTestComponent = (html?: string) =>
  createGenericTestComponent(TestComponent, html) as ComponentFixture<TestComponent>;

function getScopeLabelText(element: HTMLElement) {
  return element.querySelector('[nglpolymorphiclabel]').textContent.trim();
}

function getScopeOptions(element: HTMLElement) {
  return selectElements(element, '.slds-align-middle .slds-dropdown__item > a');
}

function expectScopeOptions(element: HTMLElement, expected: any[]) {
  const options = getScopeOptions(element);
  expect(options.map(e => e.textContent.trim())).toEqual(expected);
}

function expectPlaceholder(element: HTMLElement, expected: string) {
  const input = <HTMLInputElement>element.querySelector('input');
  expect(input.placeholder).toEqual(expected);
}

function clickScopeMenuTrigger(fixture: ComponentFixture<any>) {
  const triggerEl = <HTMLButtonElement>fixture.nativeElement.querySelector('[ngldropdowntrigger]');
  triggerEl.click();
  fixture.detectChanges();
}

function expectScopeMenuOpen(element: HTMLElement, isOpen: boolean) {
  const dropdownEl = element.querySelector('.slds-align-middle > span');
  if (isOpen) {
    expect(dropdownEl).toHaveCssClass('slds-is-open');
  } else {
    expect(dropdownEl).not.toHaveCssClass('slds-is-open');
  }
}


describe('Lookup Polymorphic', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglLookupsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();

    expect(getScopeLabelText(fixture.nativeElement)).toBe('Approvals');
    expectPlaceholder(fixture.nativeElement, 'Search Approvals');

    expectScopeMenuOpen(fixture.nativeElement, false);
    expectScopeOptions(fixture.nativeElement, []);
    expectMenuExpanded(fixture.nativeElement, false);

    expect(getPill(fixture.nativeElement)).toBeFalsy();
  });

  it('shoulp open menu on trigger click', () => {
    const fixture = createTestComponent();

    clickScopeMenuTrigger(fixture);
    expectScopeMenuOpen(fixture.nativeElement, true);
    expectScopeOptions(fixture.nativeElement, [ '1. Accounts', '2. Approvals', '3. Lead' ]);
  });

  it('shoulp change scope based on click', () => {
    const fixture = createTestComponent();

    clickScopeMenuTrigger(fixture);
    const options = getScopeOptions(fixture.nativeElement);
    options[2].click();
    fixture.detectChanges();
    expectScopeMenuOpen(fixture.nativeElement, false);
    expect(getScopeLabelText(fixture.nativeElement)).toBe('Lead');
    expectPlaceholder(fixture.nativeElement, 'Search Lead');
  });

  it('should close results menu when scope menu opens', () => {
    const fixture = createTestComponent();

    fixture.componentInstance.value = 'DE';
    fixture.detectChanges();
    expectMenuExpanded(fixture.nativeElement, true);

    clickScopeMenuTrigger(fixture);
    fixture.detectChanges();
    expectScopeMenuOpen(fixture.nativeElement, true);
    expectMenuExpanded(fixture.nativeElement, false);
  });
});


@Component({
  template: `
    <ngl-lookup label="Lookup:" [value]="value" [lookup]="filter" [(pick)]="selection" debounce="0" [placeholder]="'Search ' + scope.label">
      <span nglPolymorphicLabel>{{scope.label}}</span>
      <ng-template nglPolymorphicItem [scopes]="scopes" (scopeChange)="scope = $event" let-scope>
        {{ scope.icon }}. {{ scope.label }}
      </ng-template>
    </ngl-lookup>`,
})
export class TestComponent {

  selection: any;
  value: string;

  scopes = [
    { label: 'Accounts', icon: '1' },
    { label: 'Approvals', icon: '2' },
    { label: 'Lead', icon: '3' },
  ];

  scope = this.scopes[1];

  filter = jasmine.createSpy('filter').and.callFake(() => ['ABCDE', 'DEFGH', 'EHIJ']);
}
