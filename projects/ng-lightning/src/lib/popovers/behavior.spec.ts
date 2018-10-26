import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent, dispatchEvent} from '../../test/util/helpers';
import {NglPopoversModule} from './module';
import {getPopoverElement} from './popover.spec';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

describe('`NglPopoverBehavior`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPopoversModule]}));

  it('should add `tabindex` to make it focusable', () => {
    const fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;
    expect(triggerEl.getAttribute('tabindex')).toBe('0');
  });

  it('should change visibility based on mouse', () => {
    const fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;
    dispatchEvent(triggerEl, 'mouseenter');
    expect(getPopoverElement(fixture.nativeElement)).toBeTruthy();

    dispatchEvent(triggerEl, 'mouseleave');
    expect(getPopoverElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should change visibility based on focus', () => {
    const fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;
    dispatchEvent(triggerEl, 'focus');
    expect(getPopoverElement(fixture.nativeElement)).toBeTruthy();

    dispatchEvent(triggerEl, 'blur');
    expect(getPopoverElement(fixture.nativeElement)).toBeFalsy();
  });

  it('should create more than one instances', () => {
    const fixture = createTestComponent();
    const triggerEl = fixture.nativeElement.firstElementChild;
    dispatchEvent(triggerEl, 'focus');
    dispatchEvent(triggerEl, 'mouseenter');
    expect(fixture.nativeElement.querySelectorAll('ngl-popover').length).toBe(1);
  });
});

@Component({
  template: `
    <ng-template #tip>I am a tooltip</ng-template>
    <span [nglPopover]="tip" nglPopoverBehavior>Open here</span>
  `,
})
export class TestComponent {}
