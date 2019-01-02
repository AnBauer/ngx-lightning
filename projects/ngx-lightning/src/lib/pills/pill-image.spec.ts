import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { getPill } from './pill.spec';
import { createGenericTestComponent } from '../../test/util/helpers';
import { NglPillsModule } from './module';
import { NglImagesModule } from '../images/module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getIcon(element: HTMLElement): any {
  const pill = getPill(element);
  return pill.childNodes[0];
}

describe('NglPill', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [TestComponent],
    imports     : [NglPillsModule, NglImagesModule]
  }));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const icon = getIcon(fixture.nativeElement);
    // expect(icon).toHaveCssClass('slds-pill__icon');
    expect(icon).toHaveCssClass('slds-pill__icon');
  });

  it('should not conflict with avatars', () => {
    const fixture = createTestComponent(`<ngl-pill><ngl-avatar nglPillImage></ngl-avatar>I am a pill!</ngl-pill>`);
    const icon = getIcon(fixture.nativeElement);
    expect(icon).toHaveCssClass('slds-pill__icon');
    expect(icon).toHaveCssClass('slds-avatar');
    expect(icon).not.toHaveCssClass('slds-avatar--medium');
  });

});

@Component({
  template: `
    <ngl-pill>
      <svg nglPillImage></svg>
      I am a pill!
    </ngl-pill>
  `
})
export class TestComponent {
}
