import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[nglPicklistItem]'})
export class NglPicklistItemTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
