import {Component, Input, ChangeDetectionStrategy, HostBinding} from '@angular/core';
import {toBoolean} from '../util/util';

@Component({
  selector: 'ngl-spinner',
  templateUrl: './spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglSpinnerComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'brand' |  'inverse';

  private _container = false;
  @HostBinding('class.slds-spinner_container') get hasContainer() {
    return this._container;
  }
  @Input() set container(container: string | boolean) {
    this._container = toBoolean(container);
  }
}
