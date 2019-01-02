import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngl-icon-waffle,[ngl-icon-waffle]',
  templateUrl: './waffle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.slds-icon-waffle_container]': 'true',
  },
})
export class NglIconWaffleComponent {}
