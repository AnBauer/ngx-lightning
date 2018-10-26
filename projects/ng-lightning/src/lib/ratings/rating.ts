import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NglRatingIconTemplateDirective } from './icons';
import { NglConfig, NglConfigurable } from '../config/config';
import { toBoolean } from '../util/util';

@Component({
  selector: 'ngl-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rating.html',
  host: {
    'style': 'white-space: nowrap;',
    'tabindex': '0',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max',
  },
})
@NglConfigurable()
export class NglRatingComponent implements OnInit, AfterContentInit {

  range: number[] = [];
  currentRate: number;

  @Input() icon = 'favorite';
  @Input() size: 'x-small' | 'small' | 'large';
  @Input() set isReadonly(readonly: any) {
    this.readonly = toBoolean(readonly);
  }
  @Input() set rate(rate: number) {
    this.inputRate = rate;
    this.currentRate = rate;
  }

  @ViewChild('t') defaultTemplate: TemplateRef<any>;
  @ContentChild(NglRatingIconTemplateDirective) iconTemplate: NglRatingIconTemplateDirective;

  @Input() set max(max: number | string) {
    this._max = +max;
    this.setRange();
  }
  get max() {
    return this._max;
  }

  @Input() colorOn: string;
  @Input() colorOff: string;

  @Output() rateChange = new EventEmitter<number>();
  @Output() hover = new EventEmitter<number>();

  private _template: TemplateRef<any>;
  private _max = 5;
  private readonly = false;
  private inputRate: number;

  constructor(private config: NglConfig, private cd: ChangeDetectorRef) {
    this.nglOnConfigChanges();
  }

  ngOnInit() {
    this.setRange();
  }

  ngAfterContentInit() {
    this._template = this.iconTemplate ? this.iconTemplate.templateRef : this.defaultTemplate;
  }

  nglOnConfigChanges() {
    this.colorOn = this.config.get('ratingColorOn');
    this.colorOff = this.config.get('ratingColorOff');
  }

  update(value: number) {
    if (value < 1 || value > this.max || this.readonly || value === this.inputRate) { return; }
    this.rateChange.emit(value);
  }

  enter(value: number) {
    if (this.readonly) { return; }

    this.currentRate = value;
    this.hover.emit(value);
  }

  getFill(value: number) {
    if (value <= this.currentRate) {
      return 100;
    }
    if (Math.ceil(this.currentRate) < value) {
      return 0;
    }

    return Math.round(100 * (this.currentRate % 1));
  }

  @HostListener('mouseleave') reset() {
    this.currentRate = this.inputRate;
  }

  // Keyboard interactions
  @HostListener('keydown.ArrowUp', ['$event'])
  @HostListener('keydown.ArrowRight', ['$event'])
  keyboardIncrease(evt: KeyboardEvent) {
    evt.preventDefault();
    this.update(this.inputRate + 1);
  }

  @HostListener('keydown.ArrowDown', ['$event'])
  @HostListener('keydown.ArrowLeft', ['$event'])
  keyboardDecrease(evt: KeyboardEvent) {
    evt.preventDefault();
    this.update(this.inputRate - 1);
  }

  // ARIA
  @HostBinding('attr.aria-valuenow') get ariaValuenow() {
    return this.inputRate;
  }

  private setRange() {
    this.range = Array.apply(null, {length: this.max}).map((value: any, index: number) => index + 1);
  }
}
