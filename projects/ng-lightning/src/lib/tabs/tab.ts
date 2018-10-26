import { Directive, Input, TemplateRef, Output, EventEmitter, Optional } from '@angular/core';

/*
 * <ng-template ngl-tab heading="...">
 *    Content goes here...
 * </ng-template>
 */
@Directive({
  selector: '[ngl-tab]',
  exportAs: 'nglTab'
})
export class NglTabDirective {
  @Input() nglTabId: string;
  @Input() heading: string | TemplateRef<any>;
  @Output() onActivate = new EventEmitter<NglTabDirective>();
  @Output() onDeactivate = new EventEmitter<NglTabDirective>();

  private _active = false;

  constructor(@Optional() public templateRef: TemplateRef<any>) {
  }

  set active(active: boolean) {
    if (active === this._active) {
      return;
    }

    this._active = active;
    if (active) {
      this.onActivate.emit(this);
    } else {
      this.onDeactivate.emit(this);
    }
  }

  get active(): boolean {
    return this._active;
  }
}
