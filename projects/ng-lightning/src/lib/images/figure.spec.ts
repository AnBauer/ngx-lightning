import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglImagesModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getFigureElement(element: HTMLElement) {
  return element.firstElementChild;
}

function getFigureCaptionElement(element: HTMLElement) {
  return element.querySelector('figcaption');
}

describe('Figure Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglImagesModule]}));

  it('should render the figure element with default values', () => {
    const fixture = createTestComponent();
    const figure = getFigureElement(fixture.nativeElement);
    expect(hasCssClass(figure, 'slds-image')).toBeTruthy();
    expect(hasCssClass(figure, 'slds-image--card')).toBeTruthy();
  });

  it('should render the caption element based on title', () => {
    const fixture = createTestComponent(`<figure nglFigure [nglTitle]="title"></figure>`);
    const caption = getFigureCaptionElement(fixture.nativeElement);
    expect(hasCssClass(caption, 'slds-image__title')).toBeTruthy();
    expect(hasCssClass(caption, 'slds-image__title--card')).toBeTruthy();

    expect((<HTMLSpanElement>caption.firstElementChild).title).toBe('Image title');
    expect(caption.textContent).toBe('Image title');

    fixture.componentInstance.title = '';
    fixture.detectChanges();
    expect(getFigureCaptionElement(fixture.nativeElement)).toBeFalsy();
  });
});


@Component({ template: `<figure nglFigure></figure>` })
export class TestComponent {
  ratio: string = '4-by-3';
  title: string = 'Image title';
}
