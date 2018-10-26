import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef,
  Renderer2,
  Optional,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { NglNotificationClose } from './notification-close';
import { replaceClass, isInt } from '../util/util';

@Component({
  selector       : 'ngl-notification',
  templateUrl    : './notification.html',
  host           : {
    '[class.slds-notify]': 'true',
    'role'               : 'alert'
  },
  styles         : [
      `:host.slds-notify--alert {
      display: block;
    }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs       : 'nglNotification'
})
export class NglNotificationComponent implements OnChanges, OnDestroy {
  @Input() type: 'toast' | 'alert' = 'toast';

  @Input('severity') set setSeverity(severity: string) {
    this.severity = severity === 'info' ? null : severity;
  }

  @Input() assistiveText: string;
  @Input() closeAssistiveText: string;

  @Input() set timeout(timeout: number) {
    this.clearTimeout();
    if (isInt(timeout) && timeout >= 0) {
      this.currentTimeout = setTimeout(() => this.close('timeout'), +timeout);
    }
  }

  @Output('nglNotificationClose') closeEventEmitter = new EventEmitter<string>();

  severity: string;
  showClose = false;
  private currentTimeout: any = null;

  constructor(public element: ElementRef, public renderer: Renderer2, @Optional() notificationClose: NglNotificationClose) {
    this.showClose = !!notificationClose;
  }

  ngOnChanges(changes: any) {
    const {type: changedType, setSeverity: changedSeverity} = changes;
    if (changedType) {
      const previousValue = typeof(changedType.previousValue) === 'string' ? changedType.previousValue : '';
      replaceClass(this, `slds-notify--${previousValue}`, `slds-notify--${changedType.currentValue}`);
    }
    if (changedSeverity) {
      const previousValue = typeof(changedSeverity.previousValue) === 'string' ? changedSeverity.previousValue : '';
      replaceClass(this, `slds-theme--${previousValue}`, changedSeverity.currentValue ? `slds-theme--${changedSeverity.currentValue}`
                                                                                      : null);
    }
  }

  close(reason?: string, $event?: Event) {
    this.clearTimeout();
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.closeEventEmitter.emit(reason);
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  private clearTimeout() {
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }
}
