import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../../test/util/helpers';
import {NglIconsModule} from './module';
import {NglConfig} from '../config/config';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

describe('SVG icon Component', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [TestComponent],
    imports: [NglIconsModule],
  }));

  it('should render correctly', () => {
    const fixture = createTestComponent(`<svg nglIcon="warning"></svg>`);
    const svg = fixture.nativeElement.firstElementChild;
    const use = svg.querySelector('use');

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(use.getAttribute('xlink:href')).toBe('/mypath/utility-sprite/svg/symbols.svg#warning');
  });

  it('should change `use` path based on input', () => {
    const fixture = createTestComponent(`<svg [nglIcon]="icon" [nglIconCategory]="category"></svg>`, false);
    fixture.componentInstance.icon = 'icon1';
    fixture.componentInstance.category = 'custom';
    fixture.detectChanges();

    const use = fixture.nativeElement.firstElementChild.querySelector('use');
    expect(use.getAttribute('xlink:href')).toBe('/mypath/custom-sprite/svg/symbols.svg#icon1');

    fixture.componentInstance.icon = 'icon2';
    fixture.componentInstance.category = 'standard';
    fixture.detectChanges();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/standard-sprite/svg/symbols.svg#icon2');
  });

});

@Component({ template: '' })
export class TestComponent {
  icon: string;
  category: string;

  constructor(config: NglConfig) {
    config.update({ svgPath: '/mypath' });
  }
}
