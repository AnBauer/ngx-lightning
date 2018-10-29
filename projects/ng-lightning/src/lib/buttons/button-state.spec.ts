import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, selectElements } from '../../test/util/helpers';
import { NglButtonsModule } from './module';
import { NglIconsModule } from '../icons/module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getButtonElement(element: Element): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('`nglButtonState`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglButtonsModule, NglIconsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const button = getButtonElement(fixture.nativeElement);
    expect(button.getAttribute('aria-live')).toBe('assertive');

    const icons = selectElements(button, 'svg');
    expect(icons.length).toBe(3);
    icons.forEach((icon) => {
      expect(icon).toHaveCssClass('slds-button__icon--stateful');
      expect(icon).not.toHaveCssClass('slds-icon');
      expect(icon).not.toHaveCssClass('slds-button__icon');
      expect(icon).toHaveCssClass('slds-button__icon--left');
    });
  });

  it('should toggle state based on input', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;
    const button = getButtonElement(fixture.nativeElement);
    expect(button).toHaveCssClass('slds-not-selected');

    componentInstance.selected = true;
    fixture.detectChanges();
    expect(button).not.toHaveCssClass('slds-not-selected');
    expect(button).toHaveCssClass('slds-is-selected');

    componentInstance.selected = false;
    fixture.detectChanges();
    expect(button).toHaveCssClass('slds-not-selected');
    expect(button).not.toHaveCssClass('slds-is-selected');
  });

  it('should emit the appopriate state on click', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;
    componentInstance.change = jasmine.createSpy('change');

    const button = getButtonElement(nativeElement);
    button.click();
    expect(componentInstance.change).toHaveBeenCalledWith(true);
  });

});

@Component({
  template: `
    <button type="button" [nglButtonState]="selected" (nglButtonStateChange)="change($event)">
      <ngl-icon icon="add" state="not-selected">Follow</ngl-icon>
      <ngl-icon icon="check" state="selected">Following</ngl-icon>
      <ngl-icon icon="close" state="selected-focus">Unfollow</ngl-icon>
    </button>
  `,
})
export class TestComponent {
  selected = false;

  change($event: boolean) {
    this.selected = $event;
  }
}
