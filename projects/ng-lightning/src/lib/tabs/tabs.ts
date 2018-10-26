import { Component, Input, QueryList, ContentChildren, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { isInt, toBoolean } from '../util/util';
import { NglTabDirective } from './tab';

@Component({
  selector   : 'ngl-tabs',
  templateUrl: './tabs.html'
})
export class NglTabsComponent implements AfterContentInit {
  @Input() type: 'default' | 'scoped' = 'default';

  @ContentChildren(NglTabDirective) tabs: QueryList<NglTabDirective>;

  activeTab: NglTabDirective;
  selected: string | number | NglTabDirective;

  @Input('selected') set setSelected(selected: string | number | NglTabDirective) {
    if (selected === this.selected) {
      return;
    }

    this.selected = selected;

    if (!this.tabs) {
      return;
    } // Wait for content to initialize

    this.activate();
  }

  @Output() selectedChange = new EventEmitter<NglTabDirective>();

  @Input() set titleCaps(titleCaps: any) {
    this._titleCaps = toBoolean(titleCaps);
  }

  get titleCaps() {
    return this._titleCaps;
  }

  private _titleCaps = true;

  ngAfterContentInit() {
    // Initial selection after all tabs are created
    this.activate();
    if (!this.activeTab) {
      setTimeout(() => this.select(this.tabs.first));
    }
  }

  select(tab: NglTabDirective) {
    this.selectedChange.emit(tab);
  }

  move(evt: Event, moves: number) {
    evt.preventDefault();

    const tabs = this.tabs.toArray();
    const selectedIndex = tabs.indexOf(this.activeTab);
    this.select(tabs[(tabs.length + selectedIndex + moves) % tabs.length]);
  }

  private activate() {
    if (this.activeTab) {
      this.activeTab.active = false;
    }
    this.activeTab = this.findTab();
    if (this.activeTab) {
      this.activeTab.active = true;
    }
  }

  private findTab(value: any = this.selected): NglTabDirective {
    if (value instanceof NglTabDirective) {
      return value;
    }
    if (isInt(value)) {
      return this.tabs.toArray()[+value];
    }
    return this.tabs.toArray().find((t: NglTabDirective) => {
      return t.nglTabId && t.nglTabId === value;
    });
  }
}
