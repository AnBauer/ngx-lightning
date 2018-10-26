import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { createGenericTestComponent, dispatchKeyEvent, hasCssClass, selectElements } from '../../test/util/helpers';
import { By } from '@angular/platform-browser';
import { NglPickModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getElements(element: HTMLElement): any {
  return {
    options: <HTMLButtonElement[]>selectElements(element, 'button'),
  };
}

function expectState(element: HTMLElement, state: boolean[], activeClass = 'slds-button--brand') {
  const { options } = getElements(element);
  expect(options.length).toBe(state.length);
  expect(options.map((o: HTMLElement) => o.classList.contains(activeClass))).toEqual(state);
}

describe('`Pick`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPickModule]}));

  it('should have proper option selected based on input', () => {
    const fixture = createTestComponent();
    expectState(fixture.nativeElement, [true, false, false, false]);

    fixture.componentInstance.selected = 'op2';
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, true, false, false]);
  });

  it('should render options with the appropriate aria role', () => {
    const fixture = createTestComponent();
    const { options } = getElements(fixture.nativeElement);
    options.forEach((o: HTMLElement) => expect(o.getAttribute('role')).toBe('button'));
  });

  it('should have proper option selected even if selected value is object', () => {
    const fixture = createTestComponent();
    const {nativeElement, componentInstance} = fixture;
    componentInstance.selected = componentInstance.options[2];
    fixture.detectChanges();
    expectState(nativeElement, [false, false, false, true]);
  });

  it('should handle different active class', () => {
    const fixture = createTestComponent(`
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)">
        <button type="button" nglPickOption="op1" nglPickActiveClass="my-active-class"></button>
        <button type="button" nglPickOption="op2" nglPickActiveClass="another-class"></button>
      </div>`);
    const { options } = getElements(fixture.nativeElement);

    fixture.componentInstance.selected = 'op1';
    fixture.detectChanges();
    expect(hasCssClass(options[0], 'my-active-class')).toBeTruthy();
    expect(hasCssClass(options[0], 'slds-button--brand')).toBeFalsy();
    expect(hasCssClass(options[1], 'another-class')).toBeFalsy();
    expect(hasCssClass(options[0], 'slds-button--brand')).toBeFalsy();

    fixture.componentInstance.selected = 'op2';
    fixture.detectChanges();
    expect(hasCssClass(options[0], 'my-active-class')).toBeFalsy();
    expect(hasCssClass(options[0], 'slds-button--brand')).toBeFalsy();
    expect(hasCssClass(options[1], 'another-class')).toBeTruthy();
    expect(hasCssClass(options[0], 'slds-button--brand')).toBeFalsy();
  });

  it('should have proper selected value when `nglPickOption` is clicked', () => {
    const fixture = createTestComponent();
    const { options } = getElements(fixture.nativeElement);
    options[2].click();
    expect(fixture.componentInstance.selected).toBe('op3');
  });

  it('should have proper selected value when `nglPickOption` is used with keyboard', () => {
    const fixture = createTestComponent();

    function dispatchKey(key: string, index: number) {
      dispatchKeyEvent(fixture, By.css('button'), `keydown.${key}`, index);
    }

    dispatchKey('Enter', 1);
    expect(fixture.componentInstance.selected).toBe('op2');
    dispatchKey('Space', 2);
    expect(fixture.componentInstance.selected).toBe('op3');
    dispatchKey('ArrowDown', 1);
    expect(fixture.componentInstance.selected).toBe('op3');
  });

  it('should have proper option selected when a new option is added', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.selected = 'op5';
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, false, false, false]);

    fixture.componentInstance.options.push('op5');
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, false, false, false, true]);
  });

  it('call `nglOptionDestroyed` when a selected option is removed', async(() => {
    const fixture = createTestComponent(`
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" (nglOptionDestroyed)="destroyed($event)">
        <button type="button" nglPickOption="option1"></button>
        <button type="button" nglPickOption="option2"></button>
        <button type="button" nglPickOption="option3" *ngIf="exists"></button>
      </div>`);
    fixture.componentInstance.selected = 'option3';
    fixture.componentInstance.exists = true;
    fixture.componentInstance.nglButtonStateChange = jasmine.createSpy('selectedChange');
    fixture.detectChanges();

    fixture.componentInstance.exists = false;
    fixture.detectChanges();
    setTimeout(() => {
      expect(fixture.componentInstance.selectedChange).not.toHaveBeenCalled();
      expect(fixture.componentInstance.destroyed).toHaveBeenCalledWith('option3');
    });
  }));

  it('not call `nglOptionDestroyed` when a not selected option is removed', async(() => {
    const fixture = createTestComponent(`
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" (nglOptionDestroyed)="destroyed($event)">
        <button type="button" nglPickOption="option1"></button>
        <button type="button" nglPickOption="option2"></button>
        <button type="button" nglPickOption="option3" *ngIf="exists"></button>
      </div>
    `, false);
    fixture.componentInstance.selected = 'option2';
    fixture.componentInstance.exists = true;
    fixture.componentInstance.nglButtonStateChange = jasmine.createSpy('selectedChange');
    fixture.detectChanges();

    fixture.componentInstance.exists = false;
    fixture.detectChanges();
    setTimeout(() => {
      expect(fixture.componentInstance.selectedChange).not.toHaveBeenCalled();
      expect(fixture.componentInstance.destroyed).not.toHaveBeenCalled();
    });
  }));

  it('should allow picking from outside and expose state', () => {
    const fixture = createTestComponent(`
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" nglPickActiveClass="slds-button--brand">
        <button type="button" nglPickOption="op1" #opt1="nglPickOption"></button>
        <button type="button" nglPickOption="op2" #opt2="nglPickOption"></button>
      </div>
      <button type="button" (click)="opt2.pick()" class="outside">Trigger</button>
      <span>{{opt1.active}}-{{opt2.active}}</span>`);
    const spanEl = <HTMLSpanElement>fixture.nativeElement.querySelector('span');
    const triggerEl = <HTMLButtonElement>fixture.nativeElement.querySelector('button.outside');

    fixture.detectChanges();
    expect(spanEl.textContent).toBe('true-false');

    fixture.componentInstance.nglButtonStateChange = jasmine.createSpy('selectedChange');
    triggerEl.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedChange).toHaveBeenCalledWith('op2');
  });
});


@Component({
  template: `
    <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" nglPickActiveClass="slds-button--brand">
      <button type="button" nglPickOption="op1"></button>
      <button type="button" *ngFor="let option of options" [nglPickOption]="option"></button>
    </div>
  `,
})
export class TestComponent {
  @Input() nglButtonStateChange: any;
  selected: any = 'op1';
  options = ['op2', 'op3', {}];
  exists: boolean;

  destroyed = jasmine.createSpy('destroyed');

  selectedChange(event: any) {
    this.selected = event;
  }
}
