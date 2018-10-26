import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, selectElements } from '../../test/util/helpers';
import { NglPickModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function expectState(element: HTMLElement, state: boolean[], activeClass = 'slds-button--brand') {
  const options = selectElements(element, 'button');
  expect(options.length).toBe(state.length);
  expect(state).toEqual(options.map(o => o.classList.contains(activeClass)));
}

describe('Pick multiple array', () => {
  let HTML = `
    <div [(nglPick)]="selected" nglPickMultiple nglPickActiveClass="slds-button--brand">
      <button type="button" nglPickOption="op1"></button>
      <button type="button" *ngFor="let option of options" [nglPickOption]="option"></button>
    </div>
  `;

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPickModule]}));

  it('should have proper options selected based on input', () => {
    const fixture = createTestComponent(HTML);
    expectState(fixture.nativeElement, [true, false, true, false]);

    fixture.componentInstance.selected = ['op2', 'op3'];
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, true, true, false]);
  });

  it('should have proper selected value when `nglPickOption` is clicked', () => {
    const fixture = createTestComponent(HTML);
    const elements = selectElements(fixture.nativeElement, 'button');

    elements[2].click();
    expect(fixture.componentInstance.selected).toEqual(['op1']);

    fixture.detectChanges();
    elements[2].click();
    expect(fixture.componentInstance.selected).toEqual(['op1', 'op3']);

    fixture.detectChanges();
    elements[1].click();
    expect(fixture.componentInstance.selected).toEqual(['op1', 'op3', 'op2']);
  });

  it('should have proper option selected when a new option is added', () => {
    const fixture = createTestComponent(HTML, false);
    fixture.componentInstance.selected = ['op5'];
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, false, false, false]);

    fixture.componentInstance.options.push('op5');
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, false, false, false, true]);
  });

  it('call `nglOptionDestroyed` when a selected option is removed', async(() => {
    const fixture = createTestComponent(`
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" nglPickMultiple (nglOptionDestroyed)="destroyed($event)">
        <button type="button" nglPickOption="option1"></button>
        <button type="button" nglPickOption="option2"></button>
        <button type="button" nglPickOption="option3" *ngIf="exists"></button>
      </div>
    `, false);
    fixture.componentInstance.selected = ['option2', 'option3'];
    fixture.componentInstance.exists = true;
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
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" nglPickMultiple (nglOptionDestroyed)="destroyed($event)">
        <button type="button" nglPickOption="option1"></button>
        <button type="button" nglPickOption="option2"></button>
        <button type="button" nglPickOption="option3" *ngIf="exists"></button>
      </div>
    `, false);
    fixture.componentInstance.selected = null;
    fixture.componentInstance.exists = true;
    fixture.detectChanges();

    fixture.componentInstance.exists = false;
    fixture.detectChanges();
    setTimeout(() => {
      expect(fixture.componentInstance.selectedChange).not.toHaveBeenCalled();
      expect(fixture.componentInstance.destroyed).not.toHaveBeenCalled();
    });
  }));
});

describe('Pick multiple object', () => {
  let HTML = `
    <div [(nglPick)]="selectedObject" nglPickMultiple nglPickActiveClass="slds-button--brand">
      <button type="button" nglPickOption="op1"></button>
      <button type="button" *ngFor="let option of options" [nglPickOption]="option"></button>
    </div>
  `;

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPickModule]}));

  it('should have proper options selected based on input', () => {
    const fixture = createTestComponent(HTML);
    expectState(fixture.nativeElement, [true, false, true, false]);

    fixture.componentInstance.selectedObject = {op2: true, op3: true};
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, true, true, false]);
  });

  it('should have proper selected value when `nglPickOption` is clicked', () => {
    const fixture = createTestComponent(HTML);
    const elements = selectElements(fixture.nativeElement, 'button');

    elements[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedObject).toEqual({ op1: true, op2: false, op3: false, op4: false });

    elements[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedObject).toEqual({ op1: true, op2: false, op3: true, op4: false });

    fixture.detectChanges();
    elements[1].click();
    expect(fixture.componentInstance.selectedObject).toEqual({ op1: true, op2: true, op3: true, op4: false });
  });

  it('should have proper option selected when a new option is added', () => {
    const fixture = createTestComponent(HTML);
    fixture.componentInstance.selectedObject = {op5: true};
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, false, false, false]);

    fixture.componentInstance.options.push('op5');
    fixture.detectChanges();
    expectState(fixture.nativeElement, [false, false, false, false, true]);
  });

  it('call `nglOptionDestroyed` when a selected option is removed', async(() => {
    const fixture = createTestComponent(`
      <div [nglPick]="selected" (nglPickChange)="selectedChange($event)" nglPickMultiple (nglOptionDestroyed)="destroyed($event)">
        <button type="button" nglPickOption="option1"></button>
        <button type="button" nglPickOption="option2"></button>
        <button type="button" nglPickOption="option3" *ngIf="exists"></button>
      </div>
    `, false);
    fixture.componentInstance.selected = {'option2': true, 'option3': true};
    fixture.componentInstance.exists = true;
    fixture.detectChanges();

    fixture.componentInstance.exists = false;
    fixture.detectChanges();
    setTimeout(() => {
      expect(fixture.componentInstance.selectedChange).not.toHaveBeenCalled();
      expect(fixture.componentInstance.destroyed).toHaveBeenCalledWith('option3');
    });
  }));
});


@Component({ template: '' })
export class TestComponent {
  selected: any = ['op1', 'op3'];
  selectedObject: any = {'op1': true, 'op2': false, 'op3': true, 'op4': false};
  options = ['op2', 'op3', 'op4'];

  exists: boolean;
  destroyed = jasmine.createSpy('destroyed');
  selectedChange = jasmine.createSpy('selectedChange');
}
