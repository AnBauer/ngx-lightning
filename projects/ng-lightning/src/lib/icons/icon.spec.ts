import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglIconsModule } from './module';
import { NglConfig } from '../config/config';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getElements(element: Element) {
  const assistiveEl = element.querySelector('.slds-assistive-text');

  return {
    host: <HTMLElement>element.firstElementChild,
    icon: <SVGSVGElement>element.querySelector('svg'),
    assistiveText: assistiveEl ? assistiveEl.textContent.trim() : null,
  };
}

describe('Icon Component', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [TestComponent],
    imports: [NglIconsModule],
  }));

  it('should render all the icon elements', () => {
    const fixture = createTestComponent(`<ngl-icon icon="warning" alt="Help!"></ngl-icon>`);

    const { nativeElement } = fixture;
    const { host, icon, assistiveText } = getElements(nativeElement);
    const use = icon.querySelector('use');

    expect(hasCssClass(host, 'slds-icon_container')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-icon-text-error')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-warning')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeFalsy();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/utility-sprite/svg/symbols.svg#warning');
    expect(assistiveText).toEqual('Help!');
  });

  it('should set type based on input', () => {
    const fixture = createTestComponent(`<ngl-icon icon="warning" [type]="type"></ngl-icon>`);
    const { nativeElement, componentInstance } = fixture;
    const { icon } = getElements(nativeElement);

    componentInstance.type = 'default';
    fixture.detectChanges();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-icon-text-error')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-warning')).toBeFalsy();

    componentInstance.type = 'warning';
    fixture.detectChanges();
    expect(hasCssClass(icon, 'slds-icon-text-warning')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-icon-text-error')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeFalsy();

    componentInstance.type = 'error';
    fixture.detectChanges();
    expect(hasCssClass(icon, 'slds-icon-text-error')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-icon-text-warning')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeFalsy();

    componentInstance.type = 'false';
    fixture.detectChanges();
    expect(hasCssClass(icon, 'slds-icon-text-error')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-warning')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeFalsy();
  });

  it('should set size based on input', () => {
    const fixture = createTestComponent(`<ngl-icon icon="warning" [size]="size"></ngl-icon>`);
    const { nativeElement, componentInstance } = fixture;
    const { icon } = getElements(nativeElement);
    expect(hasCssClass(icon, 'slds-icon--small')).toBeTruthy();

    componentInstance.size = 'large';
    fixture.detectChanges();
    expect(hasCssClass(icon, 'slds-icon--small')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon--large')).toBeTruthy();
  });

  it('should allow extra svg classes', () => {
    const fixture = createTestComponent(`<ngl-icon [svgClass]="svgClass"></ngl-icon>`);
    const { nativeElement, componentInstance } = fixture;
    const { icon } = getElements(nativeElement);
    expect(hasCssClass(icon, 'anextra')).toBeTruthy();
    expect(hasCssClass(icon, 'fancy')).toBeTruthy();
    expect(hasCssClass(icon, 'one')).toBeTruthy();

    componentInstance.svgClass = ['another', 'one'];
    fixture.detectChanges();
    expect(hasCssClass(icon, 'anextra')).toBeFalsy();
    expect(hasCssClass(icon, 'fancy')).toBeFalsy();
    expect(hasCssClass(icon, 'one')).toBeTruthy();
    expect(hasCssClass(icon, 'another')).toBeTruthy();

    componentInstance.svgClass = null;
    fixture.detectChanges();
    expect(hasCssClass(icon, 'one')).toBeFalsy();
    expect(hasCssClass(icon, 'another')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon')).toBeTruthy();
  });

  it('should support sprite category', () => {
    const fixture = createTestComponent(`<ngl-icon [category]="type" icon="add"></ngl-icon>`);
    const { nativeElement, componentInstance } = fixture;

    componentInstance.type = 'standard';
    fixture.detectChanges();

    const { host, icon } = getElements(nativeElement);
    const use = icon.querySelector('use');

    expect(hasCssClass(host, 'slds-icon_container')).toBeTruthy();
    expect(hasCssClass(host, 'slds-icon-standard-add')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeFalsy();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/standard-sprite/svg/symbols.svg#add');

    componentInstance.type = 'utility';
    fixture.detectChanges();
    expect(hasCssClass(host, 'slds-icon_container')).toBeFalsy();
    expect(hasCssClass(host, 'slds-icon-standard-add')).toBeFalsy();
    expect(hasCssClass(icon, 'slds-icon-text-default')).toBeFalsy();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/utility-sprite/svg/symbols.svg#add');
  });

  it('should handle icons with underscore', () => {
    const fixture = createTestComponent(`<ngl-icon [category]="type" [icon]="icon"></ngl-icon>`);
    const { nativeElement, componentInstance } = fixture;

    componentInstance.type = 'standard';
    componentInstance.icon = 'work_order';
    fixture.detectChanges();

    const { host, icon } = getElements(nativeElement);
    const use = icon.querySelector('use');

    expect(hasCssClass(host, 'slds-icon-standard-work-order')).toBeTruthy();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/standard-sprite/svg/symbols.svg#work_order');
  });

  it('should handle custom icons', () => {
    const fixture = createTestComponent(`<ngl-icon category="custom" icon="1"></ngl-icon>`);
    const { host, icon } = getElements(fixture.nativeElement);
    const use = icon.querySelector('use');
    expect(hasCssClass(host, 'slds-icon-custom-custom1')).toBeTruthy();
    expect(use.getAttribute('xlink:href')).toBe('/mypath/custom-sprite/svg/symbols.svg#custom1');
  });
});


@Component({
  template: '',
})
export class TestComponent {
  size = 'small';
  icon: string;
  type: string;
  svgClass: any = 'anextra fancy one';

  constructor(config: NglConfig) {
    config.update({ svgPath: '/mypath' });
  }
}
