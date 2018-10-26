import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[ngl-modal-footer]'})
export class NglModalFooterDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
