import {TestBed, ComponentFixture} from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../../test/util/helpers';
import {NglBreadcrumbsModule} from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getBreadcrumbsLinks(element: HTMLElement): HTMLLinkElement[] {
 return [].slice.call(element.querySelectorAll('a'));
}

function getAssistiveText(element: HTMLElement): string {
  const el = <HTMLElement>element.querySelector('nav');
  return el.getAttribute('aria-label');
}

describe('Breadcrumbs Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglBreadcrumbsModule]}));

  it('should have the proper structure when rendered', () => {
    const fixture = createTestComponent();
    const anchors = getBreadcrumbsLinks(fixture.nativeElement);

    anchors.map(el => el.parentElement).forEach(parentEl => {
      expect(parentEl.tagName).toBe('LI');
      expect(parentEl).toHaveCssClass('slds-breadcrumb__item');
      expect(parentEl.parentElement.tagName).toBe('OL');
    });
  });

  it('should have anchor across the path', () => {
    const fixture = createTestComponent();
    const anchors = getBreadcrumbsLinks(fixture.nativeElement);

    expect(anchors.map(el => el.getAttribute('href'))).toEqual(['/here', '/there']);
    expect(anchors.map(el => el.textContent)).toEqual(['Here I am!', 'There I was!']);
    expect(anchors.map(el => el.classList.toString())).toEqual(['custom', '']);
  });

  it('should render assistive text correctly', () => {
    const fixture = createTestComponent(`<ngl-breadcrumbs [assistiveText]="text"></ngl-breadcrumbs>`);
    expect(getAssistiveText(fixture.nativeElement)).toEqual('Here you are:');
  });
});


@Component({
  template: `
    <ngl-breadcrumbs [assistiveText]="text">
      <a *nglBreadcrumb href="/here" class="custom">Here I am!</a>
      <a *nglBreadcrumb href="/there">There I was!</a>
    </ngl-breadcrumbs>`,
})
export class TestComponent {
  text: string = 'Here you are:';
}
