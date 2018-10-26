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

describe('`nglButtonIcon`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglButtonsModule, NglIconsModule]}));

  it('should render the appropriate button icon class based on input', () => {
    const fixture = createTestComponent();
    const {componentInstance, nativeElement} = fixture;
    const button = getButtonElement(nativeElement);

    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-button')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--icon-border')).toBeTruthy();

    componentInstance.style = '';
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-button--icon')).toBeFalsy();
    expect(hasCssClass(button, 'slds-button--icon-border')).toBeTruthy();

    componentInstance.style = 'container';
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-button--icon-container')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--icon')).toBeFalsy();

    componentInstance.style = null;
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-button--icon-border')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--icon-container')).toBeFalsy();
  });

  it('should render the appropriate icon', () => {
    const fixture = createTestComponent();
    const button = getButtonElement(fixture.nativeElement);
    const icon = button.querySelector('svg');
    expect(hasCssClass(icon, 'slds-button__icon')).toBeTruthy();
  });

  it('should render the default button icon when attribute value is empty', () => {
    const fixture = createTestComponent(`<button nglButtonIcon=""></button>`);
    const button = getButtonElement(fixture.nativeElement);
    expect(hasCssClass(button, 'slds-button--icon-border')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--icon')).toBeFalsy();
  });

  it('should render the default button icon when attribute value is not set', () => {
    const fixture = createTestComponent(`<button nglButtonIcon></button>`);
    const button = getButtonElement(fixture.nativeElement);
    expect(hasCssClass(button, 'slds-button--icon')).toBeFalsy();
    expect(hasCssClass(button, 'slds-button--icon-border')).toBeTruthy();
  });

  it(`should render the bare button for ''`, () => {
    const fixture = createTestComponent(`<button nglButtonIcon="''"></button>`);
    const button = getButtonElement(fixture.nativeElement);
    expect(hasCssClass(button, 'slds-button--icon')).toBeTruthy();
    expect(hasCssClass(button, 'slds-button--icon-border')).toBeFalsy();
  });
});

@Component({
  template: `<button [nglButtonIcon]="style"><ngl-icon icon="add"></ngl-icon></button>`,
})
export class TestComponent {
  style: string;
}
