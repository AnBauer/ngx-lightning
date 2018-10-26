import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[nglFormLabel]'})
export class NglFormLabelTemplateDirective {
  constructor(public templateRef: TemplateRef<any>) {
  }
}

export function getFormLabel(label: string, labelTemplate: NglFormLabelTemplateDirective): string | TemplateRef<any> {
  if (label) {
    return label;
  }
  return labelTemplate ? labelTemplate.templateRef : '';
}
