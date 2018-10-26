import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { getPill } from './pill.spec';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglPillsModule } from './module';
import { NglImagesModule } from '../images/module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getIcon(element: HTMLElement): any {
  const pill = getPill(element);
  return pill.childNodes[1];
}

describe('NglPill', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPillsModule, NglImagesModule]}));

  it('should render correctly', () => {
    const fixture = createTestComponent();
    const icon = getIcon(fixture.nativeElement);
    expect(hasCssClass(icon, 'slds-pill__icon')).toBeTruthy();
  });

  it('should not conflict with avatars', () => {
    const fixture = createTestComponent(`<ngl-pill><ngl-avatar nglPillImage></ngl-avatar>I am a pill!</ngl-pill>`);
    const icon = getIcon(fixture.nativeElement);
    expect(hasCssClass(icon, 'slds-pill__icon')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-avatar')).toBeTruthy();
    expect(hasCssClass(icon, 'slds-avatar--medium')).toBeFalsy();
  });

});

@Component({
  template: `
    <ngl-pill>
      <svg nglPillImage></svg>
      I am a pill!
    </ngl-pill>
  `,
})
export class TestComponent {}
