import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[nglDatatableCell]'})
export class NglDatatableCell {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
