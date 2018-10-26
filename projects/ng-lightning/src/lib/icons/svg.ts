import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { NglConfig, NglConfigurable } from '../config/config';

@Component({
  selector: 'svg[nglIcon]',
  templateUrl: './svg.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': 'true',
  },
})
@NglConfigurable()
export class NglIconSvgComponent {

  @Input('nglIconCategory') category = 'utility';
  @Input('nglIcon') icon: string;
  @Input() xPos = '0';

  constructor(private config: NglConfig, private cd: ChangeDetectorRef) {}

  iconPath() {
    return `${this.config.get('svgPath')}/${this.category}-sprite/svg/symbols.svg#${this.icon}`;
  }
}
