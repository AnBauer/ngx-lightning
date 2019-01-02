import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NglPickDirective } from './pick';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[nglPickOption]',
  exportAs: 'nglPickOption',
  host    : {
    'role': 'button'
  }
})
export class NglPickOptionDirective implements OnInit, OnDestroy {

  // Use a getter to prevent direct altering
  get active() {
    return this._active;
  }

  @Input('nglPickOption') set setValue(value: any) {
    this._value = value;
  }

  @Input() nglPickActiveClass: string;

  private _value: any;
  private _active = false;
  private _subscription: Subscription;

  constructor(private element: ElementRef, private renderer: Renderer2, private nglPick: NglPickDirective) {
  }

  @HostListener('click')
  @HostListener('keydown.Space', ['$event'])
  @HostListener('keydown.Enter', ['$event'])
  pick(evt?: Event) {
    if (evt) {
      evt.preventDefault();
    }
    this.nglPick.selectOption(this._value);
  }

  ngOnInit() {
    this._subscription = this.nglPick.values.subscribe(value => {
      this._active = this._isActive(value);

      const activeClass = this.nglPickActiveClass || this.nglPick.nglPickActiveClass;
      if (activeClass) {
        if (this.active) {
          this.renderer.addClass(this.element.nativeElement, activeClass);
        } else {
          this.renderer.removeClass(this.element.nativeElement, activeClass);
        }
      }
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
    this.nglPick.optionRemoved(this._value);
  }

  private _isActive(value: any) {
    if (this.nglPick.isMultiple) {
      if (!value) {
        return false;
      }
      return Array.isArray(value) ? value.indexOf(this._value) > -1 : !!value[this._value];
    } else {
      return this._value === value;
    }
  }
}
