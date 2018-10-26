import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../../test/util/helpers';
import {NglIconsModule} from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

describe('`ngl-icon-waffle`', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [TestComponent],
    imports: [NglIconsModule],
  }));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const host = fixture.nativeElement.firstElementChild;

    expect(host).toHaveCssClass('slds-icon-waffle_container');
    expect(host.firstElementChild).toHaveCssClass('slds-icon-waffle');
  });
});

@Component({ template: '<div ngl-icon-waffle></div>' })
export class TestComponent {
}
