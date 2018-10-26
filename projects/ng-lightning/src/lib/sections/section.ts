import {Component, Input, Output, EventEmitter, HostBinding, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'ngl-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section.html',
  host: {
    '[class.slds-section]': 'true',
  },
})
export class NglSectionComponent {

  @Input() title: string;

  @HostBinding('class.slds-is-open')
  @Input() open = false;

  @Output() openChange = new EventEmitter<boolean>();

  toggle(event: Event) {
    event.preventDefault();
    this.openChange.emit(!this.open);
  }
}
