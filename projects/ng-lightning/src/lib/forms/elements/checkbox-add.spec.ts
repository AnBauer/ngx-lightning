import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../../../test/util/helpers';
import {NglFormsModule} from '../module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getInputElement(element: Element): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

function getLabelElement(element: Element): HTMLLabelElement {
  return <HTMLLabelElement>element.querySelector('label');
}

function getAssistiveElement(element: Element): HTMLLabelElement {
  return <HTMLLabelElement>element.querySelector('.slds-assistive-text');
}

describe('`NglFormCheckboxAdd`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const element = fixture.nativeElement.firstElementChild;

    expect(element).toHaveCssClass('slds-checkbox--add-button');

    const labelEl = getLabelElement(element);
    expect(labelEl).toHaveCssClass('slds-checkbox--faux');

    const assistiveEl = getAssistiveElement(labelEl);
    expect(assistiveEl).toHaveText('Add product');

    const inputEl = getInputElement(element);
    expect(inputEl).toHaveCssClass('slds-assistive-text');

  });

});

@Component({
  template: `
    <ngl-form-checkbox-add [label]="label" >
      <input nglFormControl type="checkbox" />
    </ngl-form-checkbox-add>
  `,
})
export class TestComponent {
  label: string = 'Add product';
}
