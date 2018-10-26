import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglButtonsModule } from './module';
import { NglIconsModule } from '../icons/module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getButtonElement(element: Element): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('`nglButton`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglButtonsModule, NglIconsModule]}));

  it('should render the default button', () => {
    const fixture = createTestComponent();
    const button = getButtonElement(fixture.nativeElement);
    expect(hasCssClass(button, 'slds-button')).toBeTruthy();
  });

  it('should render icon correctly', () => {
    const fixture = createTestComponent(`<button [nglButton]="style"><ngl-icon icon="download" align="left"></ngl-icon> Download</button>`);
    const button = getButtonElement(fixture.nativeElement);
    const icon = button.querySelector('svg');
    expect(hasCssClass(icon, 'slds-button__icon')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-button__icon--left')).toBeTruthy();
  });

  it('should render dynamic style', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;

    const button = getButtonElement(fixture.nativeElement);
    expect(hasCssClass(button, 'slds-button')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--brand')).toBeTruthy();

    componentInstance.style = 'destructive';
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-button')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--destructive')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--brand')).toBeFalsy();

    componentInstance.style = null;
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-button')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--destructive')).toBeFalsy();
    expect(hasCssClass(button, 'slds-button--brand')).toBeFalsy();
  });
});


@Component({
  template: `<button [nglButton]="style">Go <</button>`,
})
export class TestComponent {
  style: string = 'brand';
  size: string;
}
