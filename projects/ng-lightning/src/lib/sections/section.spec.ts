import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglSectionsModule } from './module';

const createTestComponent = (html?: string) =>
  createGenericTestComponent(TestComponent, html) as ComponentFixture<TestComponent>;

function getSectionEl(element: HTMLElement) {
  return element.firstElementChild;
}
function getTitleEl(element: HTMLElement) {
  return <HTMLDivElement>element.querySelector('.slds-section__title-action');
}


describe('Section Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglSectionsModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const { nativeElement } = fixture;
    const sectionEl = getSectionEl(nativeElement);

    fixture.detectChanges();
    expect(hasCssClass(sectionEl, 'slds-section')).toBeTruthy();
    expect(hasCssClass(sectionEl, 'slds-is-open')).toBeFalsy();
    expect(getTitleEl(nativeElement).textContent.trim()).toBe('Section title');
    expect(nativeElement.querySelector('.slds-section__content').textContent).toBe('Body');
  });

  it('should toggle based on input', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;
    const sectionEl = getSectionEl(nativeElement);

    componentInstance.open = true;
    fixture.detectChanges();
    expect(hasCssClass(sectionEl, 'slds-is-open')).toBeTruthy();

    componentInstance.open = false;
    fixture.detectChanges();
    expect(hasCssClass(sectionEl, 'slds-is-open')).toBeFalsy();
  });

  it('should toggle when clicking on title', () => {
    const fixture = createTestComponent();
    const sectionEl = getSectionEl(fixture.nativeElement);
    const titleEl = getTitleEl(fixture.nativeElement);

    titleEl.click();
    fixture.detectChanges();
    expect(hasCssClass(sectionEl, 'slds-is-open')).toBeTruthy();

    titleEl.click();
    fixture.detectChanges();
    expect(hasCssClass(sectionEl, 'slds-is-open')).toBeFalsy();
  });

});

@Component({
  template: `<ngl-section [(open)]="open" title="Section title">Body</ngl-section>`,
})
export class TestComponent {
  open = false;
}
