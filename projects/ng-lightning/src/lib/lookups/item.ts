import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[nglLookupItem]'})
export class NglLookupItemTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: '[nglLookupLabel]'})
export class NglLookupLabelTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: '[nglLookupHeader]',
  host: {
    '[class.slds-lookup__item--label]': 'true',
  },
})
export class NglLookupHeaderDirective {}
