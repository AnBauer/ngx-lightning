import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Input } from '@angular/core';
import { NglFormElementComponent } from './element';
import { NglFormCheckboxDirective } from './input';
import { NglFormLabelTemplateDirective } from '../form-label';

@Component({
  selector: 'ngl-form-checkbox-add',
  templateUrl: './checkbox-add.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-checkbox--add-button]': 'true',
  },
  providers: [ {provide: NglFormElementComponent, useExisting: NglFormElementCheckboxAddComponent} ],
  styles: [`:host { display: block; }`],
})
export class NglFormElementCheckboxAddComponent extends NglFormElementComponent implements AfterContentInit {
  @ContentChild(NglFormCheckboxDirective) contentEl: NglFormCheckboxDirective;

  @Input() label: string;
  @ContentChild(NglFormLabelTemplateDirective) labelTpl: NglFormLabelTemplateDirective;

  constructor(detector: ChangeDetectorRef) {
    super(detector);
  }

  // AoT workaround
  ngAfterContentInit() {
    this.contentEl.assistive = true;
    super.ngAfterContentInit();
  }
}
