import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[nglDatatableHeading]'})
export class NglDatatableHeadingTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
