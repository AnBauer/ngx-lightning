import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../test/util/helpers';
import { NglFormsModule } from '../module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

export function getLabelElement(element: Element): HTMLLabelElement {
  return <HTMLLabelElement>element.querySelector('label');
}

function getInputElement(element: Element): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

export function getErrorElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.slds-form-element__help');
}

export function getRequiredElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('abbr');
}

describe('`NglFormInput`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(element).toHaveCssClass('slds-form-element');

    const labelEl = getLabelElement(element);
    expect(labelEl).toHaveText('My label');

    const inputEl = getInputElement(element);
    expect(inputEl).toHaveCssClass('slds-input');

    const inputId = inputEl.getAttribute('id');
    expect(inputId).toMatch(/form_element_/);
    expect(inputId).toEqual(labelEl.getAttribute('for'));
  });

  it('should be able to change label', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.label = 'Another label';
    fixture.detectChanges();

    const labelEl = getLabelElement(fixture.nativeElement);
    expect(labelEl).toHaveText('Another label');
  });

  it('should render error message', () => {
    const fixture = createTestComponent(`<ngl-form-element [error]="error"><input nglFormControl type="text"></ngl-form-element>`);
    const element = fixture.nativeElement.firstElementChild;

    expect(element).not.toHaveCssClass('slds-has-error');
    expect(getErrorElement(element)).toBeFalsy();
    fixture.componentInstance.error = 'This is an error!';
    fixture.detectChanges();

    const errorEl = getErrorElement(element);
    const inputEl = getInputElement(element);
    expect(element).toHaveCssClass('slds-has-error');
    expect(errorEl.id).toEqual(inputEl.getAttribute('aria-describedby'));
    expect(errorEl).toHaveText('This is an error!');
  });

  it('should throw error if structure is wrong', () => {
    expect(() => createTestComponent(`<ngl-form-element><input type="input"></ngl-form-element>`)).toThrowError();
  });

  it('should support tooltip', () => {
    const fixture = createTestComponent(`<ngl-form-element tooltipHelp="Field Help"><input nglFormControl type="text"></ngl-form-element>`);

    const helpEl = fixture.nativeElement.querySelector('.slds-form-element__icon');
    expect(helpEl).toBeTruthy();
    const assistiveEl = helpEl.querySelector('.slds-assistive-text');
    expect(assistiveEl).toHaveText('Help');
  });

});

@Component({
  template: `
    <ngl-form-element [label]="label">
      <input nglFormControl type="text">
    </ngl-form-element>
  `,
})
export class TestComponent {
  label: string = 'My label';
  error: string;
}
