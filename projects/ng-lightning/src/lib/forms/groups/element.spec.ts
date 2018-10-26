import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass, selectElements } from '../../../test/util/helpers';
import { NglFormsModule } from '../module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getLabelElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'label');
}

function getInputElements(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'input');
}

describe('`NglFormGroupElement`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should render checkbox group correctly', () => {
    const fixture = createTestComponent(`<fieldset ngl-form-group>
          <ngl-form-group-element [label]="label"><input nglFormControl type="checkbox" /></ngl-form-group-element>
          <ngl-form-group-element label="Checkbox Label Two"><input nglFormControl type="checkbox" /></ngl-form-group-element>
        </fieldset>`);
    const labelEls = getLabelElements(fixture.nativeElement);
    expect(labelEls.map(e => e.textContent.trim())).toEqual(['Label One', 'Checkbox Label Two']);

    const inputEls = getInputElements(fixture.nativeElement);
    expect(labelEls.map(e => e.getAttribute('for'))).toEqual(inputEls.map(e => e.getAttribute('id')));

    labelEls.forEach(e => expect(hasCssClass(e, 'slds-checkbox__label')).toBeTruthy());
  });

  it('should render radio group correctly', () => {
    const fixture = createTestComponent(`
      <fieldset ngl-form-group>
        <ngl-form-group-element [label]="label"><input nglFormControl type="radio" /></ngl-form-group-element>
        <ngl-form-group-element label="Radio Label Two"><input nglFormControl type="radio" /></ngl-form-group-element>
      </fieldset>`);
    const labelEls = getLabelElements(fixture.nativeElement);
    expect(labelEls.map(e => e.textContent.trim())).toEqual(['Label One', 'Radio Label Two']);

    const inputEls = getInputElements(fixture.nativeElement);
    expect(labelEls.map(e => e.getAttribute('for'))).toEqual(inputEls.map(e => e.getAttribute('id')));

    labelEls.forEach(e => expect(hasCssClass(e, 'slds-radio__label')).toBeTruthy());

    const names = getInputElements(fixture.nativeElement).map(e => e.getAttribute('name'));
    expect(names[0]).toMatch(/form_group_/);
    expect(names[0]).toEqual(names[1]);
  });

  it('should throw error if structure is wrong', () => {
    expect(() => createTestComponent(`<ngl-form-group-element><input nglFormControl type="radio" /></ngl-form-group-element>`)).toThrowError();
  });
});

@Component({ template: '' })
export class TestComponent {
  label: string = 'Label One';
}
