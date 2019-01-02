import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../test/util/helpers';
import { NglSpinnersModule } from './module';

const createTestComponent = (html?: string) =>
  createGenericTestComponent(TestComponent, html) as ComponentFixture<TestComponent>;

function getSpinnerElement(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.slds-spinner');
}

function getSpinnerContainer(element: Element): HTMLDivElement {
  return <HTMLDivElement>element.firstElementChild;
}

describe('Spinner Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglSpinnersModule]}));

  it('should render a medium spinner', () => {
    const fixture = createTestComponent();

    const spinner = getSpinnerElement(fixture.nativeElement);
    const image: HTMLImageElement = <HTMLImageElement>spinner.firstChild;
    const container = getSpinnerContainer(fixture.nativeElement);

    expect(spinner).toBeDefined();
    expect(spinner).toHaveCssClass('slds-spinner--medium');
    expect(container).not.toHaveCssClass('slds-spinner_container');
    expect(image).toBeDefined();
  });

  it('should render a large spinner based on input', () => {
    const fixture = createTestComponent(`<ngl-spinner [size]="'large'" ></ngl-spinner>`);
    const spinner = getSpinnerElement(fixture.nativeElement);
    expect(spinner).toHaveCssClass('slds-spinner--large');
  });

  it('should render a themed spinner based on input', () => {
    const fixture = createTestComponent(`<ngl-spinner type="brand" ></ngl-spinner>`);
    const spinner = getSpinnerElement(fixture.nativeElement);
    expect(spinner).toHaveCssClass('slds-spinner--brand');
  });

  it('should apply container class if attribute exists', () => {
    const fixture = createTestComponent(`<ngl-spinner container></ngl-spinner>`);
    const container = getSpinnerContainer(fixture.nativeElement);
    expect(container).toHaveCssClass('slds-spinner_container');
  });

  it('should apply container class based on input', () => {
    const fixture = createTestComponent(`<ngl-spinner [container]="container"></ngl-spinner>`);
    const {nativeElement, componentInstance} = fixture;
    const container = getSpinnerContainer(nativeElement);
    expect(container).toHaveCssClass('slds-spinner_container');

    componentInstance.container = false;
    fixture.detectChanges();
    expect(container).not.toHaveCssClass('slds-spinner_container');
  });

});

@Component({
  template: `<ngl-spinner></ngl-spinner>`,
})
export class TestComponent {
  container = true;
}
