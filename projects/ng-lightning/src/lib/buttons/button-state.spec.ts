import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass, selectElements } from '../../test/util/helpers';
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
      expect(hasCssClass(icon, 'slds-button__icon--stateful')).toBeTruthy();
      expect(hasCssClass(icon, 'slds-icon')).toBeFalsy();
      expect(hasCssClass(icon, 'slds-button__icon')).toBeFalsy();
      expect(hasCssClass(icon, 'slds-button__icon--left')).toBeTruthy();
    });
  });

  it('should toggle state based on input', () => {
    const fixture = createTestComponent();
    const { componentInstance } = fixture;
    const button = getButtonElement(fixture.nativeElement);
    expect(hasCssClass(button, 'slds-not-selected')).toBeTruthy();

    componentInstance.selected = true;
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-not-selected')).toBeFalsy();
    expect(hasCssClass(button, 'slds-is-selected')).toBeTruthy();

    componentInstance.selected = false;
    fixture.detectChanges();
    expect(hasCssClass(button, 'slds-not-selected')).toBeTruthy();
    expect(hasCssClass(button, 'slds-is-selected')).toBeFalsy();
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
  selected: boolean = false;

  change($event: boolean) {
    this.selected = $event;
  }
}
