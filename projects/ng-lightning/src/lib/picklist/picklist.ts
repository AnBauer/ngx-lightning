import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { NglPicklistItemTemplateDirective } from './item';
import { NglPickDirective } from '../pick/pick';
import { toBoolean } from '../util/util';
import { filter } from 'rxjs/operators';

@Component({
  selector       : 'ngl-picklist[nglPick]',
  templateUrl    : './picklist.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles         : [
      `
      li.slds-is-active {
        background-color: #F4F6F9;
      }`
  ]
})
export class NglPicklistComponent implements AfterContentInit, OnDestroy {

  filteredData: any[];

  @Input() set data(data: any[]) {
    this._data = data;
    this.filterData();
  }

  get data() {
    return this._data;
  }

  @Input() set fluid(fluid: boolean | string) {
    this._fluid = toBoolean(fluid);
  }

  get fluid() {
    return this._fluid;
  }

  @Input() set disabled(disabled: boolean | string) {
    this._disabled = toBoolean(disabled);
  }

  get disabled() {
    return this._disabled;
  }

  @Input() dropdownListClass: any;

  // tslint:disable-next-line:no-input-rename
  @Input('filter') filterType: string | Function;

  @Input() filterPlaceholder = '';

  @Input() set open(value: boolean) {
    this._open = value;
    if (this.open && this.hasFilter) {
      setTimeout(() => this.focusFilter());
    }
  }

  get open() {
    return this._open;
  }

  @Output() openChange = new EventEmitter();

  @ContentChild(NglPicklistItemTemplateDirective) itemTemplate: NglPicklistItemTemplateDirective;

  @ViewChild('filterInput') filterInput: ElementRef;

  get hasFilter() {
    return typeof(this.filterType) !== 'undefined';
  }

  private _data: any[];
  private _open = false;
  private _changeSubscription: any;
  private _disabled = false;
  private _fluid = false;
  private filter = '';
  private filterActiveIndex = 0;
  private hasFilterFocus = false;

  constructor(private pick: NglPickDirective) {
  }

  ngAfterContentInit() {
    this._changeSubscription = this.pick.nglPickChange
      .pipe(filter(() => !this.pick.isMultiple))
      .subscribe(() => this.openChange.emit(false));
  }

  ngOnDestroy() {
    if (this._changeSubscription) {
      this._changeSubscription.unsubscribe();
      this._changeSubscription = null;
    }
  }

  filterData() {
    this.filteredData = this._filterData();
    this.setFilterActive(); // Keep active index in bounds
  }

  _filterData() {
    if (!this.data || !this.hasFilter || !this.filter) {
      return this.data;
    }
    const currFilter = <any>this.filterType;
    switch (typeof(currFilter)) {
      case 'string':
        return this.data.filter(d => (currFilter ? d[currFilter] : d.toString())
          .toLowerCase()
          .indexOf(this.filter.toLowerCase()) !== -1
        );
      case 'function':
        return this.data.filter(currFilter);
      default:
        throw new Error(
          `Invalid NglPicklist filter type (${typeof(this.filterType)}). The filter must be empty, a field name or a filter function.`
        );
    }
  }

  isOptionActive(index: number) {
    return this.hasFilter && this.filterActiveIndex === index;
  }

  onOptionHover(index: number) {
    if (!this.hasFilterFocus) {
      return;
    }
    this.filterActiveIndex = index;
  }

  filterChange(f: string) {
    this.filter = f;
    this.filterData();
  }

  setFilterActive(moves: number = 0, evt?: Event) {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    this.filterActiveIndex = Math.max(Math.min(this.filterActiveIndex + moves, this.filteredData.length - 1), 0);
  }

  onFilterPick() {
    if (!this.filteredData.length || this.filterActiveIndex < 0) {
      return;
    }
    this.pick.selectOption(this.filteredData[this.filterActiveIndex]);
  }

  focusFilter() {
    this.filterInput.nativeElement.focus();
  }

  onFilterFocus() {
    this.filterActiveIndex = 0;
    this.hasFilterFocus = true;
  }

  onFilterBlur() {
    this.filterActiveIndex = -1;
    this.hasFilterFocus = false;
  }
}
