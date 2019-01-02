import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[nglDropdownItem]',
  host: {
    'tabindex': '0',
  },
})
export class NglDropdownItemDirective {
  private isFocused = false;

  @HostListener('focus') onFocus() {
    this.isFocused = true;
  }
  @HostListener('blur') onBlur() {
    this.isFocused = false;
  }

  constructor(private element: ElementRef) {}

  hasFocus() {
    return this.isFocused;
  }

  focus() {
    this.element.nativeElement.focus();
  }
}
