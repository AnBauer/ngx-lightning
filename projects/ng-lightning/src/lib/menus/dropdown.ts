import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
  ContentChildren,
  QueryList,
  Renderer2
} from '@angular/core';
import { NglDropdownItemDirective } from './dropdown-item';
import { toBoolean } from '../util/util';

const openEventEmitter = new EventEmitter<any>();

@Directive({
  selector: '[nglDropdown]',
  host    : {
    '[class.slds-dropdown-trigger]': 'true',
    '[class.slds-dropdown-trigger--click]': 'true'
  }
})
export class NglDropdownDirective implements OnInit, OnDestroy {
  @Input('open') set isOpen(isOpen: boolean) {
    this._isOpen = toBoolean(isOpen);

    if (this.isOpen) {
      this.clearGlobalClickTimeout();
      this.globalClickTimeout = setTimeout(() => {
        if (this.handlePageEvents) {
          this._subscribeToClickEvents();
        }
      });

      this.renderer.addClass(this.element.nativeElement, 'slds-is-open');
    } else {
      this._unsubscribeFromClickEvents();
      this.renderer.removeClass(this.element.nativeElement, 'slds-is-open');
    }

    this.renderer.setAttribute(this.element.nativeElement, 'aria-expanded', `${this.isOpen}`);
  }

  get isOpen() {
    return this._isOpen;
  }

  @Input() handlePageEvents = true;
  @ContentChildren(NglDropdownItemDirective, {descendants: true}) items: QueryList<NglDropdownItemDirective>;
  @Output() openChange = new EventEmitter<boolean>();

  triggerFocusEventEmitter = new EventEmitter();

  private _isOpen = false;
  private openEventSubscription: any;
  private globalClickEventUnsubscriber: Function = null;
  private clickEventUnsubscriber: Function = null;
  private globalClickTimeout: number;

  @HostListener('keydown.esc', ['"esc"'])
  @HostListener('keydown.tab', ['"tab"'])
  onKeydownClose(eventName: string) {
    this.toggle(false);
    if (eventName === 'esc') {
      this.triggerFocusEventEmitter.emit(null);
    }
  }

  @HostListener('keydown.arrowdown', ['$event', '"next"'])
  @HostListener('keydown.arrowup', ['$event', '"previous"'])
  onKeydownFocusNext($event: Event, direction: 'next' | 'previous') {
    $event.preventDefault();
    this.focusItem(direction);
  }

  constructor(public element: ElementRef, public renderer: Renderer2) {
  }

  ngOnInit() {
    this.openEventSubscription = openEventEmitter.subscribe(this.handleDropdownOpenEvent.bind(this));
  }

  ngOnDestroy() {
    this.clearGlobalClickTimeout();
    if (this.openEventSubscription) {
      this.openEventSubscription.unsubscribe();
    }
    this._unsubscribeFromClickEvents();
  }

  toggle(toggle: boolean = !this.isOpen, focus: boolean = false) {
    if (toggle === this.isOpen) {
      return;
    }
    this.openChange.emit(toggle);
    if (toggle) {
      openEventEmitter.emit(this);
      if (focus) {
        this.focusItem('next');
      }
    }
  }

  private handleGlobalClickEvent($event: any) {
    if (!this.handlePageEvents || $event.$nglStop) {
      return;
    }
    this.toggle(false);
  }

  private _subscribeToClickEvents() {
    this._unsubscribeFromClickEvents();

    // Prevent document listener to close it, since click happened inside
    this.clickEventUnsubscriber = this.renderer.listen(this.element.nativeElement, 'click', ($event: any) => $event.$nglStop = true);

    this.globalClickEventUnsubscriber = this.renderer.listen('document', 'click', this.handleGlobalClickEvent.bind(this));
  }

  private _unsubscribeFromClickEvents() {
    if (this.clickEventUnsubscriber) {
      this.clickEventUnsubscriber();
      this.clickEventUnsubscriber = null;
    }

    if (this.globalClickEventUnsubscriber) {
      this.globalClickEventUnsubscriber();
      this.globalClickEventUnsubscriber = null;
    }
  }

  private clearGlobalClickTimeout() {
    clearTimeout(this.globalClickTimeout);
  }

  private focusItem(direction: 'next' | 'previous') {
    if (!this.items.length) {
      return;
    }
    const items = this.items.toArray();
    const activeElementIndex = items.findIndex(item => item.hasFocus()) + (direction === 'next' ? 1 : -1);
    if (activeElementIndex === items.length || activeElementIndex < 0) {
      return;
    }
    items[activeElementIndex].focus();
  }

  private handleDropdownOpenEvent(dropdown: NglDropdownDirective) {
    if (dropdown !== this) {
      this.toggle(false);
    }
  }

}
