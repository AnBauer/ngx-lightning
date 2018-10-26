import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ElementRef, Renderer2} from '@angular/core';
import {NglLookupScopeItem} from './scope-item';

@Component({
  selector: 'ngl-internal-lookup-scope',
  templateUrl: './scope.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglInternalLookupScopeComponent {
  @Input() scope: NglLookupScopeItem;
  @Output() scopeChange = new EventEmitter();

  @Input() open = false;
  @Output() openChange = new EventEmitter();

  constructor(element: ElementRef, renderer: Renderer2) {
    renderer.addClass(element.nativeElement, 'slds-align-middle');
    renderer.addClass(element.nativeElement, 'slds-m-left--xx-small');
    renderer.addClass(element.nativeElement, 'slds-shrink-none');
  }

  onScopeChange(scope: any) {
    this.scopeChange.emit(scope);
  }
}
