import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[nglModalHeader]'})
export class NglModalHeaderTemplate {
  constructor(public templateRef: TemplateRef<any>) {}
}
