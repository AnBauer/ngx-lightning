import {Directive, TemplateRef, Input, Output, EventEmitter} from '@angular/core';

@Directive({selector: '[nglPolymorphicItem]'})
export class NglLookupScopeItem {
  @Input() scopes: any[] = [];

  @Output() scopeChange = new EventEmitter();

  constructor(public templateRef: TemplateRef<any>) {}
}
