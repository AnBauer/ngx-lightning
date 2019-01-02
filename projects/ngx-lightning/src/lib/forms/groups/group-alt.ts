import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, HostBinding, Input } from '@angular/core';
import { NglFormGroupComponent } from './group';
import { NglFormLabelTemplateDirective } from '../form-label';

@Component({
  selector       : 'fieldset[ngl-form-group-alt]',
  templateUrl    : './group-alt.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host           : {
    '[class.slds-form-element]': 'true'
  }
})
export class NglFormGroupAlternateComponent extends NglFormGroupComponent implements AfterContentInit {

  @Input('label') labelStr: string;
  @ContentChild(NglFormLabelTemplateDirective) labelTpl: NglFormLabelTemplateDirective;

  @HostBinding('class.slds-has-error')
  @Input() error: string;

  @Input() required: boolean;

  @Input() type: string;

  // AoT workaround
  ngAfterContentInit() {
    super.ngAfterContentInit();
  }
}
