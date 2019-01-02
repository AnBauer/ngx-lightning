import { AfterContentInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[nglPillImage]',
})
export class NglPillImageDirective implements AfterContentInit {

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    this.renderer.addClass(this.element.nativeElement, 'slds-pill__icon');
    this.renderer.removeClass(this.element.nativeElement, 'slds-avatar--medium');
  }

}
