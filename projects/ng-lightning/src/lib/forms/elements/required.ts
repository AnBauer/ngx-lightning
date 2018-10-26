import { Directive, Input } from '@angular/core';
import { NglFormElementComponent } from './element';

@Directive({
  selector: 'input[nglFormControl][required], textarea[nglFormControl][required], select[nglFormControl][required]',
})
export class NglFormElementRequiredDirective {

  constructor(private nglFormElement: NglFormElementComponent) {}

  @Input() set required(required: string | boolean) {
    this.nglFormElement.setRequired(required);
  }
}
