import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../../test/util/helpers';
import { NglFormsModule } from '../module';
import { getRequiredElement } from './input.spec';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

describe('`NglFormElementRequired`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglFormsModule]}));

  it('should hook label indication on input required', () => {
    const fixture = createTestComponent();
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
  template: `<ngl-form-element><input nglFormControl type="text" [required]="required"></ngl-form-element>`,
})
export class TestComponent {
  required: boolean;
}
