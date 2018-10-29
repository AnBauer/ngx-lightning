import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../test/util/helpers';
import { NglFormsModule } from '../module';
import { getErrorElement, getRequiredElement } from './input.spec';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getInputElement(element: Element): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

function getLabelElement(element: Element): HTMLLabelElement {
  return <HTMLLabelElement>element.querySelector('.slds-form-element__label');
}

function getEnabledTextElement(element: Element): HTMLSpanElement {
  return <HTMLSpanElement>element.querySelector('.slds-checkbox--on');
}

function getDisabledTextElement(element: Element): HTMLSpanElement {
  return <HTMLSpanElement>element.querySelector('.slds-checkbox--off');
}

describe('`NglFormCheckboxToggle`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(element).toHaveCssClass('slds-form-element');

    const labelEl = getLabelElement(fixture.nativeElement);
    expect(labelEl).toHaveText('My label');

    const enabledText = getEnabledTextElement(fixture.nativeElement);
    expect(enabledText).toHaveText('Enabled');

    const disabledText = getDisabledTextElement(fixture.nativeElement);
    expect(disabledText).toHaveText('Disabled');

    expect(getErrorElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should hook label indication on input required', () => {
    const fixture = createTestComponent(`<ngl-form-checkbox-toggle><input nglFormControl type="checkbox" [required]="required" /></ngl-form-checkbox-toggle>`);
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const abbrEl = getRequiredElement(fixture.nativeElement);
    expect(abbrEl).toHaveCssClass('slds-required');

    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should show error correctly', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.error = 'An error';
    fixture.detectChanges();

    const errorEl = getErrorElement(fixture.nativeElement);
    const inputEl = getInputElement(fixture.nativeElement);
    expect(errorEl).toHaveText('An error');
    expect(errorEl.id).toEqual(inputEl.getAttribute('aria-describedby'));
  });

  it('should be able to configure enabled/disabled text correctly', () => {
    const fixture = createTestComponent(`<ngl-form-checkbox-toggle [enabledText]="enabledText" [disabledText]="disabledText"><input nglFormControl type="checkbox" /></ngl-form-checkbox-toggle>`);
    fixture.componentInstance.enabledText = 'On';
    fixture.componentInstance.disabledText = 'Off';
    fixture.detectChanges();

    const enabledTextEl = getEnabledTextElement(fixture.nativeElement);
    expect(enabledTextEl).toHaveText('On');

    const disabledTextEl = getDisabledTextElement(fixture.nativeElement);
    expect(disabledTextEl).toHaveText('Off');
  });

});

@Component({
  template: `
    <ngl-form-checkbox-toggle [label]="label" [error]="error">
      <input nglFormControl type="checkbox" />
    </ngl-form-checkbox-toggle>
  `,
})
export class TestComponent {
  label: string = 'My label';
  required: boolean;
  error: string;
  enabledText: string;
  disabledText: string;
}
