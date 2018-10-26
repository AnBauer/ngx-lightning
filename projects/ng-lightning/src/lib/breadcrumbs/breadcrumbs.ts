import {Component, ChangeDetectionStrategy, Input, ContentChildren, QueryList} from '@angular/core';
import {NglBreadcrumbDirective} from './breadcrumb';

@Component({
 selector: 'ngl-breadcrumbs',
 templateUrl: './breadcrumbs.html',
 changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NglBreadcrumbsComponent {
  @Input() assistiveText: string;
  @ContentChildren(NglBreadcrumbDirective) breadcrumbs: QueryList<NglBreadcrumbDirective>;
}
