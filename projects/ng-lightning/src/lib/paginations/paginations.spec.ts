import {TestBed, ComponentFixture, async}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../../test/util/helpers';
import {NglPaginationsModule} from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getPageElements(element: HTMLElement): HTMLButtonElement[] {
  return [].slice.call(element.querySelectorAll('button'));
}

function expectPages(element: HTMLElement, definitions: string[]): void {
  const activeClass = 'slds-button--brand';
  const neutralClass = 'slds-button--neutral';

  const pages = getPageElements(element).map((el: HTMLButtonElement) => {
    let text = el.textContent.trim();
    if (el.classList.contains(activeClass)) {
      text = '+' + text;
      expect(el.classList).not.toContain(neutralClass);
    }
    if (el.disabled) {
      text = '-' + text;
    }
    return text;
  });

  expect(pages).toEqual(definitions);
}

describe('Pagination Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPaginationsModule]}));

  describe('with default settings', () => {

    it('should render the pages correctly', () => {
      const fixture = createTestComponent();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '+2', '3', '4', 'Next' ]);
    });

    it('should move to the requested page when clicked', () => {
      const fixture = createTestComponent();
      const pages = getPageElements(fixture.nativeElement);

      pages[2].click();
      expect(fixture.componentInstance.pageChange).not.toHaveBeenCalled();

      pages[4].click();
      expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(4);

      pages[1].click();
      expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(1);
    });

    it('should move to the requested page when clicking on `Previous` and `Next`', () => {
      const fixture = createTestComponent();
      const pages = getPageElements(fixture.nativeElement);
      expect(fixture.componentInstance.pageChange).not.toHaveBeenCalled();
      pages[0].click();
      expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(1);

      pages[5].click();
      expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(3);
    });

    it('should disable pages correctly when on limits', () => {
      const fixture = createTestComponent(null, false);
      fixture.componentInstance.page = 1;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ '-Previous', '+1', '2', '3', '4', 'Next' ]);

      fixture.componentInstance.page = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '3', '+4', '-Next' ]);
    });

    it('should move to first if none defined', async(() => {
      const fixture = createTestComponent(`<ngl-pagination [page]="unknown" [total]="total" (pageChange)="pageChange($event)"></ngl-pagination>`);
      expect(fixture.componentInstance.pageChange).not.toHaveBeenCalled();
      fixture.whenStable().then(() => {
        expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(1);
      });
    }));

    it('should keep current page inside limits when total page changes', async(() => {
      const fixture = createTestComponent();
      fixture.componentInstance.page = 4;
      fixture.detectChanges();

      fixture.componentInstance.total = 12;
      fixture.detectChanges();

      expect(fixture.componentInstance.pageChange).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(2);
      });
    }));
  });

  describe('with limit settings', () => {
    let html = `<ngl-pagination [page]="page" [total]="total" limit="2"></ngl-pagination>`;

    it('should render the pages correctly', () => {
      const fixture = createTestComponent(html);
      expectPages(fixture.nativeElement, [ 'Previous', '1', '+2', 'Next' ]);
    });

    it('should disable pages correctly when on limits', () => {
      const fixture = createTestComponent(html);
      fixture.componentInstance.page = 1;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ '-Previous', '+1', '2', 'Next' ]);

      fixture.componentInstance.page = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '3', '+4', '-Next' ]);
    });
  });

  describe('with `boundaryNumbers`', () => {
    let html = `<ngl-pagination [page]="page" boundaryNumbers="2" total="102" limit="3"></ngl-pagination>`;

    it('should render the pages correctly', () => {
      const fixture = createTestComponent(html);
      fixture.componentInstance.page = 6;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '-...', '5', '+6', '7', '-...', '10', '11', 'Next' ]);
    });

    it('should render gaps on start correctly', () => {
      const fixture = createTestComponent(html);
      expectPages(fixture.nativeElement, [ 'Previous', '1', '+2', '3', '-...', '10', '11', 'Next' ]);

      fixture.componentInstance.page = 3;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '+3', '4', '-...', '10', '11', 'Next' ]);

      fixture.componentInstance.page = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '3', '+4', '5', '-...', '10', '11', 'Next' ]);

      fixture.componentInstance.page = 5;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '3', '4', '+5', '6', '-...', '10', '11', 'Next' ]);
    });

    it('should render gaps on end correctly', () => {
      const fixture = createTestComponent(html);
      fixture.componentInstance.page = 7;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '-...', '6', '+7', '8', '9', '10', '11', 'Next' ]);

      fixture.componentInstance.page = 8;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '-...', '7', '+8', '9', '10', '11', 'Next' ]);

      fixture.componentInstance.page = 9;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '-...', '8', '+9', '10', '11', 'Next' ]);

      fixture.componentInstance.page = 10;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '-...', '9', '+10', '11', 'Next' ]);

      fixture.componentInstance.page = 11;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'Previous', '1', '2', '-...', '9', '10', '+11', '-Next' ]);
    });
  });

  describe('with `boundaryLinks`', () => {
    const html = `<ngl-pagination [page]="page" boundaryLinks [total]="total"></ngl-pagination>`;

    it('should render the `First` / `Last` buttons', () => {
      const fixture = createTestComponent(html);
      expectPages(fixture.nativeElement, [ 'First', 'Previous', '1', '+2', '3', '4', 'Next', 'Last' ]);
    });

    it('should disable the `First` / `Last` buttons correctly', () => {
      const fixture = createTestComponent(html);
      fixture.componentInstance.page = 1;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ '-First', '-Previous', '+1', '2', '3', '4', 'Next', 'Last' ]);

      fixture.componentInstance.page = 4;
      fixture.detectChanges();
      expectPages(fixture.nativeElement, [ 'First', 'Previous', '1', '2', '3', '+4', '-Next', '-Last' ]);
    });

    it('should move to the correct page when clicked', () => {
      const fixture = createTestComponent(`<ngl-pagination [page]="page" [total]="total" (pageChange)="pageChange($event)" boundaryLinks></ngl-pagination>`);
      const pages = getPageElements(fixture.nativeElement);
      expect(fixture.componentInstance.pageChange).not.toHaveBeenCalled();

      pages[0].click();
      expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(1);

      pages[7].click();
      expect(fixture.componentInstance.pageChange).toHaveBeenCalledWith(4);
    });
  });

  it('should export `start` and `end` index', () => {
    const fixture = createTestComponent(`<ngl-pagination [(page)]="page" [total]="total" #pg></ngl-pagination><h1>{{pg.start}} - {{pg.end}}</h1>`);
    const el = fixture.nativeElement.querySelector('h1');
    expect(el).toHaveText('11 - 20');

    fixture.componentInstance.page = 1;
    fixture.detectChanges();
    expect(el).toHaveText('1 - 10');

    fixture.componentInstance.page = 4;
    fixture.detectChanges();
    expect(el).toHaveText('31 - 33');

    fixture.componentInstance.total = 0;
    fixture.detectChanges();
    expect(el).toHaveText('0 - 0');
  });

  it('should support custom text in buttons', async(() => {
    const fixture = createTestComponent(`<ngl-pagination page="1" total="1" boundaryLinks
      firstText="<<" previousText="<" nextText=">" [lastText]="lastText" ></ngl-pagination>`, false);
    fixture.componentInstance.lastText = '>>';
    fixture.detectChanges();

    const pageEls = getPageElements(fixture.nativeElement);
    expect(pageEls.map(el => el.textContent)).toEqual([ '<<', '<', '1', '>', '>>' ]);

    fixture.componentInstance.lastText = '>>>';
    fixture.detectChanges();
    expect(pageEls.map(el => el.textContent)).toEqual([ '<<', '<', '1', '>', '>>>' ]);
  }));
});

@Component({
  template: `<ngl-pagination [page]="page" [total]="total" (pageChange)="pageChange($event)"></ngl-pagination>`,
})
export class TestComponent {
  page = 2;
  total = 33;
  lastText: string;
  pageChange = jasmine.createSpy('pageChange');
}
