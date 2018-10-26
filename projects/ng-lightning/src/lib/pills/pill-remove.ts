import { Directive, Input, OnInit } from '@angular/core';
import {toBoolean} from '../util/util';
import {NglPillComponent} from './pill';

@Directive({
  selector: '[nglPillRemove]',
})
export class NglPillRemoveDirective implements OnInit {

  @Input() set nglPillRemovable(removable: any) {
    this.pill.removable = toBoolean(removable);
    this.pill.detector.markForCheck();
  }

  constructor(private pill: NglPillComponent) {}

  ngOnInit() {
    if (this.pill.removable === undefined) {
      this.pill.removable = true;
    }
  }
}
