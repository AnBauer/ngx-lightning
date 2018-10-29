import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../test/util/helpers';
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
    expect(button).toHaveCssClass('slds-button');
    expect(button).toHaveCssClass('slds-button--icon-border');

    componentInstance.style = '';
    fixture.detectChanges();
    expect(button).not.toHaveCssClass('slds-button--icon');
    expect(button).toHaveCssClass('slds-button--icon-border');

    componentInstance.style = 'container';
    fixture.detectChanges();
    expect(button).toHaveCssClass('slds-button--icon-container');
    expect(button).not.toHaveCssClass('slds-button--icon');

    componentInstance.style = null;
    fixture.detectChanges();
    expect(button).toHaveCssClass('slds-button--icon-border');
    expect(button).not.toHaveCssClass('slds-button--icon-container');
  });

  it('should render the appropriate icon', () => {
    const fixture = createTestComponent();
    const button = getButtonElement(fixture.nativeElement);
    const icon = button.querySelector('svg');
    expect(icon).toHaveCssClass('slds-button__icon');
  });

  it('should render the default button icon when attribute value is empty', () => {
    const fixture = createTestComponent(`<button nglButtonIcon=""></button>`);
    const button = getButtonElement(fixture.nativeElement);
    expect(button).toHaveCssClass('slds-button--icon-border');
    expect(button).not.toHaveCssClass('slds-button--icon');
  });

  it('should render the default button icon when attribute value is not set', () => {
    const fixture = createTestComponent(`<button nglButtonIcon></button>`);
    const button = getButtonElement(fixture.nativeElement);
    expect(button).not.toHaveCssClass('slds-button--icon');
    expect(button).toHaveCssClass('slds-button--icon-border');
  });

  it(`should render the bare button for ''`, () => {
    const fixture = createTestComponent(`<button nglButtonIcon="''"></button>`);
    const button = getButtonElement(fixture.nativeElement);
    expect(button).toHaveCssClass('slds-button--icon');
    expect(button).not.toHaveCssClass('slds-button--icon-border');
  });
});

@Component({
  template: `<button [nglButtonIcon]="style"><ngl-icon icon="add"></ngl-icon></button>`,
})
export class TestComponent {
  style: string;
}
