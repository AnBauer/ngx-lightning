import {Component, Input, ElementRef, Renderer2, ChangeDetectionStrategy, Attribute, Optional, OnChanges} from '@angular/core';
import {toBoolean, replaceClass} from '../util/util';
import {NglButtonDirective} from '../buttons/button';
import {NglButtonIconDirective} from '../buttons/button-icon';

export type NglIconCategory = 'action' | 'custom' | 'doctype' | 'standard' | 'utility';

@Component({
  selector: 'ngl-icon, [ngl-icon]',
  templateUrl: './icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglIconComponent implements OnChanges {
  _icon: string;
  @Input('icon') set setIcon(icon: string) {
    this._icon = icon;
  }
  get icon() {
    return this.category === 'custom' ? `custom${this._icon}` : this._icon;
  }

  @Input('category') set setCategory(category: NglIconCategory) {
    this.category = category || 'utility';
  }
  @Input() type: 'default' | 'warning' | 'error';
  @Input() align: 'left' | 'right';
  @Input() size: 'x-small' | 'small' | 'large';
  @Input() alt: string;
  @Input() svgClass: string | string[];

  category: NglIconCategory = 'utility';

  private button: boolean;
  private _containerClass: string[];

  constructor(public element: ElementRef, public renderer: Renderer2,
              @Attribute('state') private state: string,
              @Attribute('button') button: string,
              @Optional() nglButton: NglButtonDirective, @Optional() nglButtonIcon: NglButtonIconDirective) {

    this.button = button === null ? !!(nglButton || nglButtonIcon) : toBoolean(button);
    if (state) {
      renderer.addClass(element.nativeElement, `slds-text-${state}`);
    }
  }

  ngOnChanges(changes?: any) {
    const { containerClass } = this;
    replaceClass(this, this._containerClass, containerClass);
    this._containerClass = containerClass;
  }

  svgClasses() {
    const classes = Array.isArray(this.svgClass) ? <string[]>this.svgClass : [this.svgClass || ''];

    const prefix = this.button ? 'slds-button__icon' : 'slds-icon';
    classes.push(this.state ? 'slds-button__icon--stateful' : prefix);

    if (this.size) {
      classes.push(`${prefix}--${this.size}`);
    }

    if (this.type) {
      classes.push(`slds-icon-text-${this.type}`);
    }

    if (this.align || this.state) {
      classes.push(`slds-button__icon--${this.align || 'left'}`);
    }

    return classes;
  }

  private get containerClass() {
    return /^(action|custom|standard)$/.test(this.category)
            ? ['slds-icon_container', `slds-icon-${this.category}-${this.icon.replace('_', '-')}`]
            : null;
  }
}
