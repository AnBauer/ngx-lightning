import { Directive, HostBinding, HostListener } from '@angular/core';
import { NglPopoverTriggerDirective } from './trigger';

@Directive({
  selector: '[nglPopover][nglPopoverBehavior]',
})
export class NglPopoverBehaviorDirective {

  @HostBinding('attr.tabindex') tabindex = 0;

  constructor(private trigger: NglPopoverTriggerDirective) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  onMouseOver() {
    this.trigger.nglOpen = true;
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onMouseOut() {
    this.trigger.nglOpen = false;
  }
}
