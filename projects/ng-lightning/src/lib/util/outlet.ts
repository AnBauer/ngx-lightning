import {Component, Input, TemplateRef, OnChanges} from '@angular/core';

@Component({
  selector: '[nglInternalOutlet]',
  template: `{{content}}<ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>`,
})
export class NglInternalOutletComponent implements OnChanges {
  @Input() nglInternalOutlet: string | TemplateRef<any>;

  content: string;
  contentTemplate: TemplateRef<any>;

  ngOnChanges(changes?: any) {
    [this.content, this.contentTemplate] = this.nglInternalOutlet instanceof TemplateRef
                                            ? ['', <TemplateRef<any>>this.nglInternalOutlet]
                                            : [<string>this.nglInternalOutlet, null];
  }
}
