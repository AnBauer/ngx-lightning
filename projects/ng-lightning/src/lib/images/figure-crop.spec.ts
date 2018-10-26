import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglImagesModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

describe('Figure Crop', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglImagesModule]}));

  it('should set ratio based on input', () => {
    const fixture = createTestComponent();
    const el = fixture.nativeElement.firstElementChild;
    expect(hasCssClass(el, 'slds-image__crop')).toBeTruthy();
    expect(hasCssClass(el, 'slds-image__crop--4-by-3')).toBeTruthy();

    fixture.componentInstance.ratio = null;
    fixture.detectChanges();
    expect(hasCssClass(el, 'slds-image__crop')).toBeFalsy();
    expect(hasCssClass(el, 'slds-image__crop--4-by-3')).toBeFalsy();

    fixture.componentInstance.ratio = '16-by-9';
    fixture.detectChanges();
    expect(hasCssClass(el, 'slds-image__crop')).toBeTruthy();
    expect(hasCssClass(el, 'slds-image__crop--16-by-9')).toBeTruthy();
    expect(hasCssClass(el, 'slds-image__crop--4-by-3')).toBeFalsy();
  });
});


@Component({ template: '<div [nglCrop]="ratio"></div>' })
export class TestComponent {
  ratio: string = '4-by-3';
}
