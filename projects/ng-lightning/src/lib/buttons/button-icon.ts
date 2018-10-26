import {Directive, Input, ElementRef, Renderer2} from '@angular/core';
import {replaceClass} from '../util/util';

const DEFAULT_TYPE = 'border';

@Directive({
  selector: '[nglButtonIcon]',
})
export class NglButtonIconDirective {

  private _type: string;

  @Input() set nglButtonIcon(type: 'container' | 'border' | 'border-filled' | 'small' | '') {
    replaceClass(this, this.normalize(this._type), this.normalize(type));
    this._type = type;
  }

  constructor(public element: ElementRef, public renderer: Renderer2) {
    this.renderer.addClass(this.element.nativeElement, 'slds-button');
    this.renderer.addClass(this.element.nativeElement, this.normalize());
  }

  private normalize(type?: string): string {
    return `slds-button--icon${type === `''` ? '' : `-${type || DEFAULT_TYPE}`}`;
  }
}
