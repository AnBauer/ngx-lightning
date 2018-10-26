import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Input } from '@angular/core';
import { NglFormElementComponent } from './element';
import { NglFormCheckboxDirective } from './input';
import { NglFormLabelTemplateDirective } from '../form-label';

@Component({
  selector: 'ngl-form-checkbox-toggle',
  templateUrl: './checkbox-toggle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-form-element]': 'true',
    '[class.slds-has-error]': '!!error',
  },
  providers: [ {provide: NglFormElementComponent, useExisting: NglFormElementCheckboxToggleComponent} ],
  styles: [`:host { display: block; }`],
})
export class NglFormElementCheckboxToggleComponent extends NglFormElementComponent implements AfterContentInit {
  @ContentChild(NglFormCheckboxDirective) contentEl: NglFormCheckboxDirective;

  @Input() label: string;
  @ContentChild(NglFormLabelTemplateDirective) labelTpl: NglFormLabelTemplateDirective;

  @Input() error: string;
  @Input() enabledText = 'Enabled';
  @Input() disabledText = 'Disabled';

  constructor(detector: ChangeDetectorRef) {
    super(detector);
  }

  // AoT workaround
  ngAfterContentInit() {
    super.ngAfterContentInit();
  }
}
