import {Directive, TemplateRef} from '@angular/core';

@Directive({selector: '[nglRatingIcon]'})
export class NglRatingIconTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
