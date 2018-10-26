import {Directive, Input, TemplateRef, Output, EventEmitter, ContentChild} from '@angular/core';
import {NglTabDirective} from './tab';

/*
 * <ngl-tab [heading="..."]>
 *    <ng-template ngl-tab-heading>...</ng-template>
 *    <ng-template ngl-tab-content>
 *       Content goes here...
 *    </ng-template>
 * </ngl-tab>
 */
@Directive({selector: '[ngl-tab-heading]'})
export class NglTabHeading {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({selector: '[ngl-tab-content]'})
export class NglTabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: 'ngl-tab',
  providers: [ {provide: NglTabDirective, useExisting: NglTabVerbose} ],
})
export class NglTabVerbose extends NglTabDirective {
  @Input('nglTabId') nglTabId: string;
  @Input() heading: string | TemplateRef<any>;
  @Output() onActivate = new EventEmitter<NglTabDirective>();
  @Output() onDeactivate = new EventEmitter<NglTabDirective>();

  @ContentChild(NglTabContent) contentTemplate: NglTabContent;
  @ContentChild(NglTabHeading) headingTemplate: NglTabHeading;

  ngAfterContentInit() {
    if (this.headingTemplate) {
      this.heading = this.headingTemplate.templateRef;
    }
    this.templateRef = this.contentTemplate.templateRef;
  }
}
