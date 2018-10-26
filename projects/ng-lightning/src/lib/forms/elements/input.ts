import {Directive, HostBinding, Optional} from '@angular/core';
import {NglFormGroupComponent} from '../groups/group';
import {NglFormGroupAlternateComponent} from '../groups/group-alt';


@Directive({
  selector: 'input[nglFormControl]:not([type=checkbox]), input[nglFormControl]:not([type=radio])',
  host: {
    '[class.slds-input]': 'true',
  },
})
export class NglFormInputDirective {
  @HostBinding('id') id: string;
  @HostBinding('attr.aria-describedby') describedBy: string;
}

@Directive({
  selector: 'textarea[nglFormControl]',
  providers: [ {provide: NglFormInputDirective, useExisting: NglFormTextareaDirective} ],
  host: {
    '[class.slds-textarea]': 'true',
  },
})
export class NglFormTextareaDirective {
  @HostBinding('id') id: string;
  @HostBinding('attr.aria-describedby') describedBy: string;
}

@Directive({
  selector: 'select[nglFormControl]',
  providers: [ {provide: NglFormInputDirective, useExisting: NglFormSelectDirective} ],
  host: {
    '[class.slds-select]': 'true',
  },
})
export class NglFormSelectDirective {
  @HostBinding('id') id: string;
  @HostBinding('attr.aria-describedby') describedBy: string;
}

@Directive({
  selector: 'input[nglFormControl][type=checkbox]',
  host: {
    '[class.slds-assistive-text]': 'assistive',
  },
})
export class NglFormCheckboxDirective {
  type = 'checkbox';

  assistive = false;

  @HostBinding('id') id: string;
  @HostBinding('attr.aria-describedby') describedBy: string;
}

@Directive({
  selector: 'input[nglFormControl][type=radio]',
  providers: [ {provide: NglFormCheckboxDirective, useExisting: NglFormRadioDirective} ],
})
export class NglFormRadioDirective {
  type = 'radio';

  @HostBinding('id') id: string;
  @HostBinding('attr.name') name: string;

  constructor(@Optional() formGroup: NglFormGroupComponent, @Optional() formGroupAlt: NglFormGroupAlternateComponent) {
    this.name = `name_${(formGroup || formGroupAlt).uid}`;
  }
}
