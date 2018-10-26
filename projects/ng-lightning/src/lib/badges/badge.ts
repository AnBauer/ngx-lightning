import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngl-badge',
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglBadgeComponent {
  @Input() type: string;
}
