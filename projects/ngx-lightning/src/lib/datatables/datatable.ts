import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2
} from '@angular/core';
import { NglDatatableColumn } from './column';
import { NglDatatableLoadingOverlayDirective, NglDatatableNoRowsOverlayDirective } from './overlays';
import { Subscription } from 'rxjs';

export interface INglDatatableSort {
  key: string;
  order: 'asc' | 'desc';
}

export interface INglDatatableRowClick {
  event: Event;
  data: any;
}

@Component({
  selector   : 'table[ngl-datatable]',
  templateUrl: './datatable.html',
  host       : {
    '[class.slds-is-relative]': 'loading'
  },
  styles     : [
      `
      .ngl-datatable-loading {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.5)
      }
      `
  ]
})
export class NglDatatableComponent implements OnDestroy, AfterContentInit {

  @Input() data: any[] = [];
  @Input() trackByKey: string;

  @HostBinding('class.slds-table--bordered')
  @Input() bordered = true;

  @HostBinding('class.slds-table--striped')
  @Input() striped = true;

  @Input() sort: INglDatatableSort;
  @Output() sortChange = new EventEmitter<INglDatatableSort>();

  @Input() loading = false;
  @ContentChild(NglDatatableLoadingOverlayDirective) loadingOverlay: NglDatatableLoadingOverlayDirective;

  dataTrackBy: (index: number, data: any) => number;

  get showLoading() {
    return this.loading && this.loadingOverlay;
  }

  @ContentChild(NglDatatableNoRowsOverlayDirective) noRowsOverlay: NglDatatableNoRowsOverlayDirective;

  @ContentChildren(NglDatatableColumn) columns: QueryList<NglDatatableColumn>;

  @Output() onRowClick = new EventEmitter<INglDatatableRowClick>();

  private _columnsSubscription: Subscription;

  constructor(private detector: ChangeDetectorRef, element: ElementRef, renderer: Renderer2) {
    renderer.addClass(element.nativeElement, 'slds-table');
    this.dataTrackBy = (index: number, data: any) => {
      return this.trackByKey ? data[this.trackByKey] : index;
    };
  }

  columnTrackBy(index: number, column: NglDatatableColumn) {
    return column.key || index;
  }

  onColumnSort(column: NglDatatableColumn, order: 'asc' | 'desc') {
    const key = column.key;
    if (!key) {
      throw new Error(`ng-lightning: No "key" property is set for sortable column "${column.heading}"`);
    }
    this.sortChange.emit({key, order});
  }

  getColumnSortOrder(column: NglDatatableColumn) {
    return this.sort && column.key === this.sort.key ? this.sort.order : null;
  }

  rowClick(event: Event, data: any) {
    this.onRowClick.emit({event, data});
  }

  ngAfterContentInit() {
    this._columnsSubscription = this.columns.changes.subscribe(() => this.detector.markForCheck());
  }

  ngOnDestroy() {
    if (this._columnsSubscription) {
      this._columnsSubscription.unsubscribe();
      this._columnsSubscription = null;
    }
  }
}
