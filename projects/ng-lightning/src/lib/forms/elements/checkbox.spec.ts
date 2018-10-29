import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../../test/util/helpers';
import { NglFormsModule } from '../module';
import { getErrorElement, getLabelElement, getRequiredElement } from './input.spec';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getInputElement(element: Element): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

describe('`NglFormCheckbox`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(element).toHaveCssClass('slds-form-element');

    const labelEl = getLabelElement(element);
    expect(labelEl).toHaveText('My label');

    const inputEl = getInputElement(fixture.nativeElement);
    expect(inputEl.id).toEqual(labelEl.getAttribute('for'));

    expect(getErrorElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should hook label indication on input required', () => {
    const fixture = createTestComponent(`<ngl-form-checkbox><input nglFormControl type="checkbox" [required]="required" /></ngl-form-checkbox>`);
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const abbrEl = getRequiredElement(fixture.nativeElement);
    expect(abbrEl).toHaveCssClass('slds-required');

    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should show error corectly', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.error = 'An error';
    fixture.detectChanges();

    const errorEl = getErrorElement(fixture.nativeElement);
    const inputEl = getInputElement(fixture.nativeElement);
    expect(errorEl).toHaveText('An error');
    expect(errorEl.id).toEqual(inputEl.getAttribute('aria-describedby'));
  });

});

@Component({
  template: `
    <ngl-form-checkbox [label]="label" [error]="error">
      <input nglFormControl type="checkbox" />
    </ngl-form-checkbox>
  `,
})
export class TestComponent {
  label: string = 'My label';
  required: boolean;
  error: string;
}
