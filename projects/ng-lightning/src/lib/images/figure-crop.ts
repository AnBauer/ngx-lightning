import {Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[nglCrop]',
})
export class NglFigureCropDirective {

  @Input() set nglCrop(ratio: '16-by-9' | '4-by-3' | '1-by-1') {
    const nativeElement = this.element.nativeElement;

    if (this._ratio) {
      this.renderer.removeClass(nativeElement, `slds-image__crop--${this._ratio}`);
    }

    if (ratio) {
      this.renderer.addClass(nativeElement, 'slds-image__crop');
      this.renderer.addClass(nativeElement, `slds-image__crop--${ratio}`);
    } else {
      this.renderer.removeClass(nativeElement, 'slds-image__crop');
    }

    this._ratio = ratio;
  }

  private _ratio;

  constructor(private element: ElementRef, private renderer: Renderer2) {}
}
