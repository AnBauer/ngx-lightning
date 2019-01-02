import { ContentChild, Directive, Input } from '@angular/core';
import { NglDatatableCell } from './cell';
import { NglDatatableHeadingTemplateDirective } from './heading';
import { toBoolean } from '../util/util';

@Directive({
  selector: 'ngl-datatable-column'
})
export class NglDatatableColumn {
  @Input() heading: string;
  @Input() key: string;
  @Input() headClass: any;
  @Input() cellClass: any;
  @ContentChild(NglDatatableCell) cellTpl: NglDatatableCell;
  @ContentChild(NglDatatableHeadingTemplateDirective) headingTpl: NglDatatableHeadingTemplateDirective;

  @Input() set sortable(sortable: string | boolean) {
    this._sortable = toBoolean(sortable);
  }

  get sortable() {
    return this._sortable;
  }

  private _sortable = false;
}
