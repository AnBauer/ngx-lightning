import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NglRatingComponent } from './rating';
import { NglRatingsModule } from './module';
import { createGenericTestComponent, dispatchEvent, dispatchKeyEvent, hasCssClass, selectElements } from '../../test/util/helpers';
import { By } from '@angular/platform-browser';
import { NglConfig } from '../config/config';

const createTestComponent = (html?: string) =>
  createGenericTestComponent(TestComponent, html) as ComponentFixture<TestComponent>;

const COLOR_ON = '#FFB75D';

function getStars(element: HTMLElement): HTMLElement[] {
  return selectElements(element, '.slds-show--inline-block');
}

function getICons(element: HTMLElement): HTMLElement[] {
  return selectElements(element, 'svg');
}

function dispatchKey(fixture: ComponentFixture<any>, key: string) {
  dispatchKeyEvent(fixture, By.directive(NglRatingComponent), `keydown.${key}`);
}

function rgb2hex(value: string) {
  const matches = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return matches ? [
    '#',
    ('0' + parseInt(matches[1], 10).toString(16)).slice(-2),
    ('0' + parseInt(matches[2], 10).toString(16)).slice(-2),
    ('0' + parseInt(matches[3], 10).toString(16)).slice(-2),
  ].join('').toUpperCase() : value.toUpperCase();
}

function expectState(element: HTMLElement, state: string) {
  const stars = getICons(element);
  expect(stars.length).toBe(state.length);
  expect(+element.firstElementChild.getAttribute('aria-valuemax')).toBe(state.length);
  expect(+element.firstElementChild.getAttribute('aria-valuenow')).toBe((state.match(/\*/g) || []).length);
  expect(stars.map(icon => rgb2hex(icon.style.fill) === COLOR_ON ? '*' : '-').join('')).toBe(state);
}

describe('Rating Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglRatingsModule]}));

  it('should render the stars correctly', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;
    expectState(nativeElement, '**---');

    componentInstance.value = 4;
    fixture.detectChanges();
    expectState(nativeElement, '****-');
  });

  it('should change rate based on click', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;

    const stars = getStars(nativeElement);
    expect(componentInstance.change).not.toHaveBeenCalled();

    stars[1].click();
    expect(componentInstance.change).not.toHaveBeenCalled();

    stars[3].click();
    expect(componentInstance.change).toHaveBeenCalledWith(4);
  });

  it('should notify when hovering over a specific rate', () => {
    const fixture = createTestComponent(`<ngl-rating [rate]="value" (hover)="change($event)"></ngl-rating>`);
    const { nativeElement, componentInstance } = fixture;

    const stars = getStars(nativeElement);
    expect(componentInstance.change).not.toHaveBeenCalled();

    dispatchEvent(stars[3], 'mouseenter');
    expect(componentInstance.change).toHaveBeenCalledWith(4);

    dispatchEvent(stars[0], 'mouseenter');
    expect(componentInstance.change).toHaveBeenCalledWith(1);
  });

  describe(`max`, () => {
    it('defines the available stars', () => {
      const fixture = createTestComponent(`<ngl-rating rate="5" max="10"></ngl-rating>`);
      expectState(fixture.nativeElement, '*****-----');
    });

    it('should change based on input', () => {
      const fixture = createTestComponent(`<ngl-rating rate="5" [max]="max"></ngl-rating>`);
      expectState(fixture.nativeElement, '*****');

      fixture.componentInstance.max = 10;
      fixture.detectChanges();
      expectState(fixture.nativeElement, '*****-----');
    });
  });

  it('should not change when is readonly', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;
    componentInstance.readonly = true;
    fixture.detectChanges();

    const stars = getStars(nativeElement);
    expect(componentInstance.change).not.toHaveBeenCalled();

    stars[3].click();
    expect(componentInstance.change).not.toHaveBeenCalled();
  });

  it('should not change when is readonly', () => {
    const fixture = createTestComponent();
    const { nativeElement, componentInstance } = fixture;
    componentInstance.readonly = true;
    fixture.detectChanges();

    const stars = getStars(nativeElement);
    expect(componentInstance.change).not.toHaveBeenCalled();

    stars[3].click();
    expect(componentInstance.change).not.toHaveBeenCalled();
  });

  it('should render correclty when using fractional values', () => {
    const fixture = createTestComponent(`<ngl-rating [rate]="value"></ngl-rating>`);

    fixture.componentInstance.value = 3.2;
    fixture.detectChanges();

    const stars = getICons(fixture.nativeElement);
    expect(stars.length).toBe(6);

    // First three stars are single and "on"
    for (let i = 0; i < 3; i++) {
      expect(rgb2hex(stars[i].style.fill)).toBe(COLOR_ON);
    }

    // Fourth and fifth stars show the fractional value
    const [starOff, starHalf] = [stars[3], stars[4]];
    expect(rgb2hex(starOff.style.fill)).not.toBe(COLOR_ON);
    expect(starOff.style.position).not.toBe('absolute');

    expect(rgb2hex(starHalf.style.fill)).toBe(COLOR_ON);
    expect(starHalf.style.position).toBe('absolute');
    expect(starHalf.style.left).toBe('-80%');

    const useEl = starHalf.querySelector('use');
    expect(useEl.getAttribute('x')).toBe('80%');

    // Last star is single and "off"
    expect(rgb2hex(stars[5].style.fill)).not.toBe(COLOR_ON);
  });

  describe('keyboard interaction', () => {
    it('will change value apropriately', () => {
      const fixture = createTestComponent();
      const { componentInstance } = fixture;

      expect(componentInstance.change).not.toHaveBeenCalled();

      dispatchKey(fixture, 'ArrowUp');
      expect(componentInstance.change).toHaveBeenCalledWith(3);
      dispatchKey(fixture, 'ArrowDown');
      expect(componentInstance.change).toHaveBeenCalledWith(1);

      componentInstance.change.calls.reset();

      dispatchKey(fixture, 'ArrowRight');
      expect(componentInstance.change).toHaveBeenCalledWith(3);
      dispatchKey(fixture, 'ArrowLeft');
      expect(componentInstance.change).toHaveBeenCalledWith(1);
    });

    it('will keep value in limits', () => {
      const fixture = createTestComponent();
      const { componentInstance } = fixture;
      componentInstance.value = 5;
      fixture.detectChanges();

      dispatchKey(fixture, 'ArrowUp');
      expect(componentInstance.change).not.toHaveBeenCalled();

      componentInstance.value = 1;
      fixture.detectChanges();
      dispatchKey(fixture, 'ArrowDown');
      expect(componentInstance.change).not.toHaveBeenCalled();
    });
  });

  it('should change icons size based on input', () => {
    const fixture = createTestComponent(`<ngl-rating [(rate)]="value" [size]="size"></ngl-rating>`);
    const { nativeElement, componentInstance } = fixture;
    componentInstance.size = 'small';
    fixture.detectChanges();

    const icons = getICons(nativeElement);
    icons.forEach(icon => expect(hasCssClass(icon, 'slds-icon--small')).toBeTruthy());

    componentInstance.size = 'large';
    fixture.detectChanges();
    icons.forEach(icon => {
      expect(hasCssClass(icon, 'slds-icon--small')).toBeFalsy();
      expect(hasCssClass(icon, 'slds-icon--large')).toBeTruthy();
    });

    componentInstance.size = null;
    fixture.detectChanges();
    icons.forEach(icon => {
      expect(hasCssClass(icon, 'slds-icon--small')).toBeFalsy();
      expect(hasCssClass(icon, 'slds-icon--large')).toBeFalsy();
    });
  });

  it('should have custom on/off color', () => {
    const on = '#000000';
    const off = '#FFFFFF';
    const fixture = createTestComponent(`<ngl-rating rate="3" colorOn="${on}" colorOff="${off}"></ngl-rating>`);

    const icons = getICons(fixture.nativeElement);
    expect(icons.map(icon => rgb2hex(icon.style.fill))).toEqual([on, on, on, off, off]);
  });

  it('should have configurable on/off color', () => {
    const on = '#000000';
    const off = '#FFFFFF';
    const fixture = createTestComponent(`<ngl-rating rate="3"></ngl-rating>`);

    fixture.componentInstance.updateConfig(on, off);
    fixture.detectChanges();

    const icons = getICons(fixture.nativeElement);
    expect(icons.map(icon => rgb2hex(icon.style.fill))).toEqual([on, on, on, off, off]);
  });

  describe('with custom icon', function () {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(function () {
      fixture = createTestComponent(`
        <ngl-rating [(rate)]="value">
          <ng-template nglRatingIcon let-active let-i="index" let-fill="fill">{{i}}/{{active}}/{{fill}}</ng-template>
        </ngl-rating>`);
    });

    it('should render correctly', () => {
      const stars = getStars(fixture.nativeElement);
      expect(stars.map(el => el.textContent)).toEqual(['0/true/100', '1/true/100', '2/false/0', '3/false/0', '4/false/0']);
    });

    it('should update on hover', () => {
      const stars = getStars(fixture.nativeElement);
      dispatchEvent(stars[3], 'mouseenter');
      fixture.detectChanges();
      expect(stars.map(el => el.textContent)).toEqual(['0/true/100', '1/true/100', '2/true/100', '3/true/100', '4/false/0']);
    });

    it('should expose correct fill for fractional rate', () => {
      fixture.componentInstance.value = 3.65;
      fixture.detectChanges();

      const stars = getStars(fixture.nativeElement);
      expect(stars.map(el => el.textContent)).toEqual(['0/true/100', '1/true/100', '2/true/100', '3/false/65', '4/false/0']);
    });
  });
});

@Component({
  template: `<ngl-rating [rate]="value" (rateChange)="change($event)" [isReadonly]="readonly"></ngl-rating>`,
})
export class TestComponent {
  value = 2;
  max = 5;
  readonly = false;
  size: string;
  change = jasmine.createSpy('change');

  constructor(private config: NglConfig) {}

  updateConfig(ratingColorOn: string, ratingColorOff: string) {
    this.config.update({ ratingColorOn, ratingColorOff });
  }
}
