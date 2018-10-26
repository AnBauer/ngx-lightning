import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2, OnInit } from '@angular/core';
import {replaceClass} from '../util/util';

@Component({
  selector: 'ngl-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.html',
})
export class NglAvatarComponent implements OnInit {
  @Input() src = '';
  @Input() alt = '';

  @Input('size') set setSize(value: string) {
    this.updateClass(this._size, value);
    this._size = value;
  }

  @Input('type') set setType(value: string) {
    this.updateClass(this._type, value);
    this._type = value;
  }

  private _type: string;
  private _size: string;

  constructor(public element: ElementRef, public renderer: Renderer2) {
    renderer.addClass(element.nativeElement, 'slds-avatar');
  }

  ngOnInit() {
    if (!this._type) {
      this.renderer.addClass(this.element.nativeElement, 'slds-avatar--rectangle');
    }

    if (!this._size) {
      this.renderer.addClass(this.element.nativeElement, 'slds-avatar--medium');
    }
  }

  private updateClass(oldValue: string, newValue: string) {
    replaceClass(this, `slds-avatar--${oldValue}`, newValue ? `slds-avatar--${newValue}` : '');
  }
}
