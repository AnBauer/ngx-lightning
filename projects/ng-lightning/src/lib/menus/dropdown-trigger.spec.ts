import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {NglDropdownTriggerDirective} from './dropdown-trigger';
import {createGenericTestComponent, dispatchKeyEvent} from '../../test/util/helpers';
import {By} from '@angular/platform-browser';
import {NglMenusModule} from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getDropdownTrigger(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('`nglDropdownTrigger`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglMenusModule]}));

  it('should have the attribute `aria-haspopup` set to `true`', () => {
    const fixture = createTestComponent();
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);
    expect(dropdownTrigger.getAttribute('aria-haspopup')).toBe('true');
    fixture.destroy();
  });

  it('should toggle the dropdown when it is clicked', () => {
    const fixture = createTestComponent();
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);

    dropdownTrigger.click();
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(true);

    fixture.componentInstance.open = true;
    fixture.detectChanges();

    dropdownTrigger.click();
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(false);
    fixture.destroy();
  });

  it('should open the dropdown when the down arrow key is pressed while it is focused', () => {
    const fixture = createTestComponent();
    dispatchKeyEvent(fixture, By.directive(NglDropdownTriggerDirective), 'keydown.arrowdown');
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(true);
    fixture.destroy();
  });
});


@Component({
  template: `
    <div nglDropdown [open]="open" (openChange)="setOpen($event)">
      <button type="button" nglDropdownTrigger></button>
    </div>
  `,
})
export class TestComponent {
  open: boolean = false;
  setOpen = jasmine.createSpy('setOpenDropdownTrigger');
}
