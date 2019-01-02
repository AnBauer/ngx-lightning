import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngl-pill',
  templateUrl: './pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-pill]': 'true',
  },
})
export class NglPillComponent {
  removable: boolean;
  unlinked = true;

  @Output() nglPillRemove = new EventEmitter();

  constructor(public detector: ChangeDetectorRef) {}

  remove() {
    this.nglPillRemove.emit(null);
  }
}
