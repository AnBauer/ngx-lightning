import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import { replaceClass, toBoolean, uniqueId } from '../util/util';

export type Direction = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'ngl-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './popover.html'
})
export class NglPopoverComponent implements AfterViewInit {

  @Output() afterViewInit = new EventEmitter();

  @Output() onInteraction = new EventEmitter<boolean>();

  @Input() header: string;
  @Input() footer: string;

  @Input() set theme(theme: any) {
    replaceClass(this, `slds-theme--${this._theme}`, theme ? `slds-theme--${theme}` : '');
    this._theme = theme;
  }

  @Input() set nglTooltip(isTooltip: any) {
    this.renderer[toBoolean(isTooltip) ? 'addClass' : 'removeClass'](this.element.nativeElement, 'slds-popover--tooltip');
  }

  set nubbin(direction: Direction) {
    replaceClass(this, `slds-nubbin--${this._nubbin}`, direction ? `slds-nubbin--${direction}` : '');
    this._nubbin = direction;
  }

  uid = uniqueId('popover');

  @HostBinding('attr.aria-labelledby')
  get labelledby() {
    return this.header ? `${this.uid}-heading` : null;
  }

  private _nubbin: Direction;
  private _theme: string;

  constructor(public element: ElementRef, public renderer: Renderer2, public changeDetector: ChangeDetectorRef) {
    this.renderer.addClass(this.element.nativeElement, 'slds-popover');

    // Prevent position changes of "close by" elements
    this.renderer.setStyle(this.element.nativeElement, 'position', 'absolute');

    this.renderer.setAttribute(this.element.nativeElement, 'aria-describedby', this.uid);
  }

  ngAfterViewInit() {
    this.afterViewInit.emit();
  }

  @HostListener('mouseenter', ['$event', 'true'])
  @HostListener('mouseleave', ['$event', 'false'])
  interactiveHandler(evt: Event, isEnter: boolean) {
    this.onInteraction.emit(isEnter);
  }

}
