import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[nglLoadingOverlay]'})
export class NglDatatableLoadingOverlayDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}

@Directive({selector: '[nglNoRowsOverlay]'})
export class NglDatatableNoRowsOverlayDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}
