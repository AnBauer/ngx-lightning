import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass, selectElements } from '../../test/util/helpers';
import { NglDatatablesModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getHeadings(element: HTMLElement) {
  return selectElements(element, 'thead th');
}

function getHeadingText(element: HTMLElement) {
  return element.querySelector('.slds-truncate').textContent;
}

function getHeadingsText(element: HTMLElement) {
  return getHeadings(element).map(getHeadingText);
}

function getHeadingsTitle(element: HTMLElement) {
  return getHeadings(element).map(el => el.querySelector('.slds-truncate').getAttribute('title'));
}

function getRows(element: HTMLElement): HTMLTableRowElement[] {
  return <HTMLTableRowElement[]>selectElements(element, 'tbody tr');
}

function getRowData(element: HTMLTableRowElement) {
  return selectElements(element, 'td').map(e => e.textContent.trim());
}

function getData(element: HTMLElement) {
  return getRows(element).map(row => getRowData(row));
}

function getLoadingEl(element: HTMLElement) {
  return element.querySelector('table > .ngl-datatable-loading');
}

function expectSortedHeadings(element: HTMLElement, expected: string[]) {
  const headings = getHeadings(element);

  headings.map((e: HTMLElement, index: number) => {
    const text = getHeadingText(e);
    const expectation = expected[index];
    if (expectation.startsWith('+')) {
      expect(hasCssClass(e, 'slds-is-sorted')).toBeTruthy();
      expect(hasCssClass(e, 'slds-is-sorted--asc')).toBeTruthy();
      expect(e.getAttribute('aria-sort')).toEqual('ascending');
      expect(expectation).toEqual(`+${text}`);
    } else if (expectation.startsWith('-')) {
      expect(hasCssClass(e, 'slds-is-sorted')).toBeTruthy();
      expect(hasCssClass(e, 'slds-is-sorted--desc')).toBeTruthy();
      expect(e.getAttribute('aria-sort')).toEqual('descending');
      expect(expectation).toEqual(`-${text}`);
    } else {
      expect(hasCssClass(e, 'slds-is-sorted')).toBeFalsy();
      expect(e.getAttribute('aria-sort')).toBeNull();
      expect(expectation).toEqual(text);
    }
  });
}

describe('`NglDatatable`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglDatatablesModule]}));

  it('should render head and body correctly', () => {
    const fixture = createTestComponent();

    const tableEl = fixture.nativeElement.firstElementChild;
    expect(hasCssClass(tableEl, 'slds-table')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeTruthy();

    expect(getHeadingsText(fixture.nativeElement)).toEqual(['ID', 'Name', 'Number']);
    expect(getHeadingsTitle(fixture.nativeElement)).toEqual(['ID', 'Name', 'Number']);
    expect(getData(fixture.nativeElement)).toEqual([
      ['1', 'PP', '80'],
      ['2', 'AB', '10'],
      ['3', 'KB', '13'],
      ['4', 'EB', '14']
    ]);
  });

  it('should appy bordered and striped based on input', () => {
    const fixture = createTestComponent(`<table ngl-datatable [striped]="striped" [bordered]="bordered"></table>`);
    const tableEl = fixture.nativeElement.firstElementChild;
    expect(hasCssClass(tableEl, 'slds-table')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeFalsy();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeFalsy();

    fixture.componentInstance.striped = true;
    fixture.detectChanges();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeFalsy();

    fixture.componentInstance.bordered = true;
    fixture.detectChanges();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeTruthy();
  });

  it('should appy bordered and striped based on input', () => {
    const fixture = createTestComponent(`<table ngl-datatable [striped]="striped" [bordered]="bordered"></table>`);
    const tableEl = fixture.nativeElement.firstElementChild;
    expect(hasCssClass(tableEl, 'slds-table')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeFalsy();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeFalsy();

    fixture.componentInstance.striped = true;
    fixture.detectChanges();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeFalsy();

    fixture.componentInstance.bordered = true;
    fixture.detectChanges();
    expect(hasCssClass(tableEl, 'slds-table--striped')).toBeTruthy();
    expect(hasCssClass(tableEl, 'slds-table--bordered')).toBeTruthy();
  });

  it('should show/hide column correctly', () => {
    const fixture = createTestComponent(null, false);
    fixture.componentInstance.exists = false;
    fixture.detectChanges();

    expect(getHeadingsText(fixture.nativeElement)).toEqual(['ID', 'Number']);
    expect(getData(fixture.nativeElement)).toEqual([
      ['1', '80'],
      ['2', '10'],
      ['3', '13'],
      ['4', '14']
    ]);

    fixture.componentInstance.exists = true;
    fixture.detectChanges();
    expect(getHeadingsText(fixture.nativeElement)).toEqual(['ID', 'Name', 'Number']);
    expect(getData(fixture.nativeElement)).toEqual([
      ['1', 'PP', '80'],
      ['2', 'AB', '10'],
      ['3', 'KB', '13'],
      ['4', 'EB', '14']
    ]);
  });

  it('should support custom cell template per column', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column key="id">
          <ng-template nglDatatableCell let-value>{{value}}:</ng-template>
        </ngl-datatable-column>
        <ngl-datatable-column>
          <ng-template nglDatatableCell let-row="row" let-i="index">{{i}} = {{row.name}}</ng-template>
        </ngl-datatable-column>
        <ngl-datatable-column key="number"></ngl-datatable-column>
      </table>`);
    expect(getData(fixture.nativeElement)).toEqual([
      ['1:', '0 = PP', '80'],
      ['2:', '1 = AB', '10'],
      ['3:', '2 = KB', '13'],
      ['4:', '3 = EB', '14']
    ]);
  });

  it('should support custom header class per column', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column headClass="class1"></ngl-datatable-column>
        <ngl-datatable-column [headClass]="{ class2: exists }"></ngl-datatable-column>
      </table>`);

    const rows = getHeadings(fixture.nativeElement);
    expect(hasCssClass(rows[0], 'class1')).toBeTruthy();
    expect(hasCssClass(rows[1], 'class2')).toBeTruthy();

    fixture.componentInstance.exists = false;
    fixture.detectChanges();
    expect(hasCssClass(rows[1], 'class2')).toBeFalsy();
  });

  it('should support custom cell class per column', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column [cellClass]="class1"></ngl-datatable-column>
        <ngl-datatable-column [cellClass]="class2"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.class1 = 'custom-class1';
    fixture.detectChanges();

    const rows = getRows(fixture.nativeElement).map(row => selectElements(row, 'td'));
    rows.forEach(([first, second]) => {
      expect(hasCssClass(first, 'custom-class1')).toBeTruthy();
      expect(hasCssClass(second, 'custom-class1')).toBeFalsy();
    });

    fixture.componentInstance.class1 = null;
    fixture.componentInstance.class2 = ['apply-me', 'apply-this'];
    fixture.detectChanges();
    rows.forEach(([first, second]) => {
      expect(hasCssClass(first, 'custom-class1')).toBeFalsy();
      expect(hasCssClass(second, 'apply-me')).toBeTruthy();
      expect(hasCssClass(second, 'apply-this')).toBeTruthy();
    });
  });

  it('should handle sortable columns', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column key="id" sortable></ngl-datatable-column>
        <ngl-datatable-column [sortable]="sortable"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.sortable = false;
    fixture.detectChanges();

    const [first, second] = getHeadings(fixture.nativeElement);

    expect(hasCssClass(first, 'slds-is-sortable')).toBeTruthy();
    expect(first.querySelector('a')).toBeDefined();

    expect(hasCssClass(second, 'slds-is-sortable')).toBeFalsy();
    expect(second.querySelector('a')).toBeNull();

    fixture.componentInstance.sortable = true;
    fixture.detectChanges();
    expect(hasCssClass(second, 'slds-is-sortable')).toBeTruthy();
    expect(second.querySelector('a')).toBeDefined();
  });

  it('should display sorting state', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data" [sort]="sort">
        <ngl-datatable-column heading="ID" key="id" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Name" key="name" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Number" key="number"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.sort = {key: 'id', order: 'asc'};
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['+ID', 'Name', 'Number']);

    fixture.componentInstance.sort = null;
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['ID', 'Name', 'Number']);

    fixture.componentInstance.sort = {key: 'id', order: 'desc'};
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['-ID', 'Name', 'Number']);

    fixture.componentInstance.sort = {key: 'name', order: 'asc'};
    fixture.detectChanges();
    expectSortedHeadings(fixture.nativeElement, ['ID', '+Name', 'Number']);
  });

  it('should sort when clicking on sortable header', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data" [sort]="sort" (sortChange)="sortChange($event)">
        <ngl-datatable-column heading="ID" key="id" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Name" key="name" sortable></ngl-datatable-column>
        <ngl-datatable-column heading="Number" key="number"></ngl-datatable-column>
      </table>`);
    fixture.componentInstance.sort = {key: 'id', order: 'desc'};
    fixture.detectChanges();
    expect(fixture.componentInstance.sortChange).not.toHaveBeenCalled();

    const headingLinks = getHeadings(fixture.nativeElement).map(e => <HTMLAnchorElement>e.querySelector('a'));

    headingLinks[0].click();
    expect(fixture.componentInstance.sortChange).toHaveBeenCalledWith({key: 'id', order: 'asc'});

    headingLinks[1].click();
    expect(fixture.componentInstance.sortChange).toHaveBeenCalledWith({key: 'name', order: 'desc'});
  });

  it('should not re-render templates in cell if no input has changed', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data">
        <ngl-datatable-column>
          <ng-template nglDatatableCell><button type="button" (click)="cb()"></button></ng-template>
        </ngl-datatable-column>
      </table>`);
    expect(fixture.componentInstance.cb).not.toHaveBeenCalled();

    const button1 = fixture.nativeElement.querySelector('button');
    button1.click();
    fixture.detectChanges();

    const button2 = fixture.nativeElement.querySelector('button');
    expect(button1).toBe(button2);
    expect(fixture.componentInstance.cb).toHaveBeenCalled();
  });

  it('should be able to render a loading overlay', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable [data]="data" [loading]="loading">
        <ng-template nglLoadingOverlay>Loading...</ng-template>
      </table>`);

    expect(getLoadingEl(fixture.nativeElement)).toBeFalsy();

    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const el = getLoadingEl(fixture.nativeElement);
    expect(el.textContent.trim()).toBe('Loading...');
  });

  it('should show a custom message when no data available', () => {
    const fixture = createTestComponent(`
      <table ngl-datatable>
        <ng-template nglNoRowsOverlay>No data available in table!</ng-template>
      </table>`);
    expect(getData(fixture.nativeElement)).toEqual([['No data available in table!']]);
  });

  it('should hande row click', () => {
    const fixture = createTestComponent(`
        <table ngl-datatable [data]="data" (onRowClick)="rowClick($event)">
          <ngl-datatable-column key="id"></ngl-datatable-column>
        </table>`);

    const {componentInstance} = fixture;
    const rows = getRows(fixture.nativeElement);
    expect(componentInstance.rowClick).not.toHaveBeenCalled();

    rows[2].click();
    expect(componentInstance.rowClick).toHaveBeenCalledWith({event: jasmine.anything(), data: componentInstance.data[2]});

    rows[1].click();
    expect(componentInstance.rowClick).toHaveBeenCalledWith({event: jasmine.anything(), data: componentInstance.data[1]});
  });

  it('should display custom header template', () => {
    const fixture = createTestComponent(`
        <table ngl-datatable>
          <ngl-datatable-column heading="My title">
            <ng-template nglDatatableHeading>Custom heading</ng-template>
          </ngl-datatable-column>
        </table>`);
    expect(getHeadingsText(fixture.nativeElement)).toEqual(['Custom heading']);
    expect(getHeadingsTitle(fixture.nativeElement)).toEqual(['My title']);
  });

  it('should not display `undefined` title', () => {
    const fixture = createTestComponent(`
        <table ngl-datatable>
          <ngl-datatable-column>
            <ng-template nglDatatableHeading>Custom heading</ng-template>
          </ngl-datatable-column>
        </table>`);
    expect(getHeadingsText(fixture.nativeElement)).toEqual(['Custom heading']);
    expect(getHeadingsTitle(fixture.nativeElement)).toEqual([null]);
  });

  it('should track rows based on input', () => {
    const fixture = createTestComponent(`<table ngl-datatable [data]="data" trackByKey="id"></table>`);
    const rows = getRows(fixture.nativeElement);

    fixture.componentInstance.data = [...fixture.componentInstance.data.reverse()];
    fixture.detectChanges();

    const newRows = getRows(fixture.nativeElement);
    for (let i = 0, ii = fixture.componentInstance.data.length; i < ii; i++) {
      expect(rows[i]).toBe(newRows[ii - i - 1]);
    }
  });
});

@Component({
  template: `
    <table ngl-datatable [data]="data">
      <ngl-datatable-column heading="ID" key="id"></ngl-datatable-column>
      <ngl-datatable-column heading="Name" key="name" *ngIf="exists"></ngl-datatable-column>
      <ngl-datatable-column heading="Number" key="number"></ngl-datatable-column>
    </table>`
})
export class TestComponent {
  exists = true;
  striped: boolean;
  bordered: boolean;
  sortable: boolean;
  loading: boolean;

  data = [
    {id: 1, name: 'PP', number: 80},
    {id: 2, name: 'AB', number: 10},
    {id: 3, name: 'KB', number: 13},
    {id: 4, name: 'EB', number: 14}
  ];

  sort: any;

  class1: any;
  class2: any;

  sortChange = jasmine.createSpy('sortChange');
  rowClick = jasmine.createSpy('rowClick');
  cb = jasmine.createSpy('cb').and.callThrough();
}
