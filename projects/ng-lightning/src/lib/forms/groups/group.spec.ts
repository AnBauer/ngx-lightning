import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../../test/util/helpers';
import { NglFormsModule } from '../module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getLabelElement(element: Element): HTMLLegendElement {
  return <HTMLLegendElement>element.querySelector('legend');
}

function getErrorElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.slds-form-element__help');
}

function getRequiredElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('abbr');
}

describe('`NglFormGroup`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;
    expect(hasCssClass(element, 'slds-form-element')).toBeTruthy();

    const labelEl = getLabelElement(element);
    expect(labelEl).toHaveText('Group Label');
  });

  it('should be able to change label', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.label = 'Another label';
    fixture.detectChanges();

    const labelEl = getLabelElement(fixture.nativeElement);
    expect(labelEl).toHaveText('Another label');
  });

  it('should render error message', () => {
    const fixture = createTestComponent(`<fieldset ngl-form-group [error]="error"></fieldset>`);
    const element = fixture.nativeElement.firstElementChild;

    expect(hasCssClass(element, 'slds-has-error')).toBeFalsy();
    expect(getErrorElement(element)).toBeFalsy();
    fixture.componentInstance.error = 'This is an error!';
    fixture.detectChanges();

    const errorEl = getErrorElement(element);
    expect(hasCssClass(element, 'slds-has-error')).toBeTruthy();
    expect(errorEl).toHaveText('This is an error!');
  });

  it('should show required label indication', () => {
    const fixture = createTestComponent(`<fieldset ngl-form-group [required]="required"></fieldset>`);
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const abbrEl = getRequiredElement(fixture.nativeElement);
    expect(hasCssClass(abbrEl, 'slds-required')).toBeTruthy();

    fixture.componentInstance.required = false;
    fixture.detectChanges();
    expect(getRequiredElement(fixture.nativeElement)).toBeFalsy();
  });

});

@Component({
  template: `<fieldset ngl-form-group [label]="label"></fieldset>`,
})
export class TestComponent {
  label: string = 'Group Label';
  error: string;
  required: boolean;
}
