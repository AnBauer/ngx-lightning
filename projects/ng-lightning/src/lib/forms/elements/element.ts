import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnChanges,
  TemplateRef
} from '@angular/core';
import { toBoolean, uniqueId } from '../../util/util';
import { NglFormInputDirective } from './input';
import { getFormLabel, NglFormLabelTemplateDirective } from '../form-label';

@Component({
  selector       : 'ngl-form-element',
  templateUrl    : './element.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host           : {
    '[class.slds-form-element]': 'true',
    '[class.slds-has-error]'   : '!!error'
  },
  styles         : [
      `:host {
      display: block;
    }`
  ]
})
export class NglFormElementComponent implements OnChanges, AfterContentInit {
  @ContentChild(NglFormInputDirective) contentEl: NglFormInputDirective;

  @Input() label: string;
  @ContentChild(NglFormLabelTemplateDirective) labelTpl: NglFormLabelTemplateDirective;

  @Input() tooltipHelp: string;

  @Input() error: string;

  uid = uniqueId('form_element');

  required = false;

  _label: TemplateRef<any> | string;

  constructor(protected detector: ChangeDetectorRef) {
  }

  ngOnChanges(changes?: any) {
    this.setFormLabel();
    this.setInputErrorId();
  }

  ngAfterContentInit() {
    if (!this.contentEl) {
      throw Error(`Couldn't find an input, textarea or select with [nglFormControl] attribute inside <ngl-form-element>`);
    }
    this.contentEl.id = this.uid;
    this.setInputErrorId();
    this.setFormLabel();
  }

  setRequired(required: string | boolean) {
    this.required = toBoolean(required);
    this.detector.markForCheck();
  }

  protected setInputErrorId() {
    if (!this.contentEl) {
      return;
    }
    this.contentEl.describedBy = this.error ? `error_${this.uid}` : null;
  }

  protected setFormLabel() {
    this._label = getFormLabel(this.label, this.labelTpl);
  }
}
