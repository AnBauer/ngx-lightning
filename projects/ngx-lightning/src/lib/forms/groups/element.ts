import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { NglFormGroupAlternateComponent } from './group-alt';
import { NglFormCheckboxDirective } from '../elements/input';
import { getFormLabel, NglFormLabelTemplateDirective } from '../form-label';
import { uniqueId } from '../../util/util';

@Component({
  selector       : 'ngl-form-group-element',
  templateUrl    : './element.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NglFormGroupElementComponent implements OnChanges, AfterContentInit {
  @ContentChild(NglFormCheckboxDirective) contentEl: NglFormCheckboxDirective;

  @Input('label') labelStr: string;
  @ContentChild(NglFormLabelTemplateDirective) labelTpl: NglFormLabelTemplateDirective;

  _label: TemplateRef<any> | string;

  uid = uniqueId('form_element');

  get labelClass() {
    return `slds-${this.contentEl.type}${this.groupAlt ? '--button' : ''}__label`;
  }

  constructor(@Optional() public groupAlt: NglFormGroupAlternateComponent, private element: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes?: any) {
    this.setFormLabel();
  }

  ngAfterContentInit() {
    if (!this.contentEl) {
      throw Error(`Couldn't find an input radio or checkbox with [nglFormControl] attribute inside <ngl-form-group-element>`);
    }

    const {type} = this.contentEl;

    if (this.groupAlt) {
      this.groupAlt.type = type;
      this.renderer.addClass(this.element.nativeElement, 'slds-button');
      this.renderer.addClass(this.element.nativeElement, `slds-${type}--button`);
    } else {
      this.renderer.addClass(this.element.nativeElement, `slds-${type}`);
    }

    this.contentEl.id = this.uid;
    this.setFormLabel();
  }

  private setFormLabel() {
    this._label = getFormLabel(this.labelStr, this.labelTpl);
  }
}
