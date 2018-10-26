import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
  ContentChild,
  TemplateRef,
  OnChanges,
  AfterContentInit
} from '@angular/core';
import {uniqueId} from '../../util/util';
import {NglFormLabelTemplateDirective, getFormLabel} from '../form-label';

@Component({
  selector: 'fieldset[ngl-form-group]',
  templateUrl: './group.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-form-element]': 'true',
  },
})
export class NglFormGroupComponent implements OnChanges, AfterContentInit {

  @Input('label') labelStr: string;
  @ContentChild(NglFormLabelTemplateDirective) labelTpl: NglFormLabelTemplateDirective;

  @HostBinding('class.slds-has-error')
  @Input() error: string;

  @Input() required: boolean;

  uid = uniqueId('form_group');

  _label: string | TemplateRef<any>;

  ngOnChanges(changes?: any) {
    this.setFormLabel();
  }

  ngAfterContentInit() {
    this.setFormLabel();
  }

  private setFormLabel() {
    this._label = getFormLabel(this.labelStr, this.labelTpl);
  }
}
