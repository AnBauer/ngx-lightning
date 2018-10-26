import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { toBoolean } from '../util/util';

@Directive({
  selector: '[nglButtonState]'
})
export class NglButtonStateDirective {

  _selected: boolean;
  @Input('nglButtonState') set selected(_selected) {
    this._selected = toBoolean(_selected);

    this.toggleClass('slds-is-selected', this._selected);
    this.toggleClass('slds-not-selected', !this._selected);
  }

  @HostBinding('attr.aria-live') ariaLive = 'button';
  @Output() nglButtonStateChange = new EventEmitter<boolean>();

  get selected() {
    return this._selected;
  }

  constructor(public element: ElementRef, public renderer: Renderer2) {
  }

  @HostListener('click')
  onSelectChange() {
    this.nglButtonStateChange.emit(!this.selected);
  }

  private toggleClass(className: string, isAdd: boolean) {
    if (isAdd) {
      this.renderer.addClass(this.element.nativeElement, className);
    } else {
      this.renderer.removeClass(this.element.nativeElement, className);
    }
  }
}
