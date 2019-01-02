import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglInternalOutletModule } from '../util/outlet.module';
import { NglPopoversModule } from '../popovers/module';
import { NglIconsModule } from '../icons/module';

import { NglFormElementComponent } from './elements/element';
import { NglFormElementCheckboxComponent } from './elements/checkbox';
import { NglFormElementCheckboxToggleComponent } from './elements/checkbox-toggle';
import { NglFormElementCheckboxAddComponent } from './elements/checkbox-add';
import {
  NglFormCheckboxDirective,
  NglFormInputDirective,
  NglFormRadioDirective,
  NglFormSelectDirective,
  NglFormTextareaDirective
} from './elements/input';
import { NglFormElementRequiredDirective } from './elements/required';
import { NglFormGroupComponent } from './groups/group';
import { NglFormGroupAlternateComponent } from './groups/group-alt';
import { NglFormGroupElementComponent } from './groups/element';
import { NglFormLabelTemplateDirective } from './form-label';

const NGL_FORM_DIRECTIVES = [
  NglFormElementComponent, NglFormElementCheckboxComponent, NglFormElementCheckboxToggleComponent, NglFormElementCheckboxAddComponent,
  NglFormInputDirective, NglFormTextareaDirective, NglFormSelectDirective, NglFormCheckboxDirective, NglFormRadioDirective,
  NglFormElementRequiredDirective,
  NglFormGroupComponent,
  NglFormGroupAlternateComponent,
  NglFormGroupElementComponent,
  NglFormLabelTemplateDirective
];

@NgModule({
  declarations: NGL_FORM_DIRECTIVES,
  exports     : NGL_FORM_DIRECTIVES,
  imports     : [CommonModule, NglInternalOutletModule, NglPopoversModule, NglIconsModule]
})
export class NglFormsModule {
}
