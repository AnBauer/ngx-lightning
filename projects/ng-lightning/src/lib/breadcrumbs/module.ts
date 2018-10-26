import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NglBreadcrumbsComponent} from './breadcrumbs';
import {NglBreadcrumbDirective} from './breadcrumb';

const NGL_BREADCRUMB_DIRECTIVES = [
  NglBreadcrumbsComponent,
  NglBreadcrumbDirective,
];

@NgModule({
  declarations: [NGL_BREADCRUMB_DIRECTIVES],
  exports: [NGL_BREADCRUMB_DIRECTIVES],
  imports: [CommonModule],
})
export class NglBreadcrumbsModule {}
