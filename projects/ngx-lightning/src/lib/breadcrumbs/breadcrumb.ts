import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[nglBreadcrumb]',
})
export class NglBreadcrumbDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
