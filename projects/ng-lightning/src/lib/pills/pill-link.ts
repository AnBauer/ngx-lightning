import { Directive, ElementRef, Optional, Renderer2 } from '@angular/core';
import { NglPillComponent } from './pill';

@Directive({
  selector: 'a'
})
export class NglPillLinkDirective {

  constructor(@Optional() pill: NglPillComponent, element: ElementRef, renderer: Renderer2) {
    if (!pill) {
      return;
    }

    renderer.addClass(element.nativeElement, 'slds-pill__label');
    pill.unlinked = false;
  }

}
