import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent } from '../../test/util/helpers';
import { NglPillsModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

export function getPill(root: HTMLElement): any {
  return root.firstElementChild;
}

function getLabelEl(pill: HTMLElement): HTMLElement {
  return <HTMLElement>pill.querySelector('.slds-pill__label');
}

function getRemoveButton(pill: HTMLElement): any {
   return <HTMLButtonElement>pill.querySelector('button');
}

describe('NglPill', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglPillsModule]}));

  it('should have the proper css classes and text content', () => {
    const fixture = createTestComponent();
    const pill = getPill(fixture.nativeElement);
    const text = getLabelEl(pill);
    const removeButton = getRemoveButton(pill);
    expect(pill).toHaveCssClass('slds-pill');
    expect(text.tagName).toBe('A');
    expect(text.textContent.trim()).toBe('I am a pill!');
    expect(removeButton).toHaveCssClass('slds-pill__remove');
  });

  it('should render unlinked correctly', () => {
    const fixture = createTestComponent(`<ngl-pill>I am unlinked!</ngl-pill>`);
    const pill = getPill(fixture.nativeElement);
    const text = getLabelEl(pill);
    expect(text.tagName).toBe('SPAN');
    expect(text.textContent.trim()).toBe('I am unlinked!');
  });

  it('should not render the remove button without `nglPillRemove`', () => {
    const fixture = createTestComponent(`<ngl-pill></ngl-pill>`);
    const pill = getPill(fixture.nativeElement);
    expect(getRemoveButton(pill)).toBeNull();
  });

  it('should not render the remove button without `nglPillRemove` even with `nglPillRemovable`', () => {
    const fixture = createTestComponent(`<ngl-pill nglPillRemovable="true"></ngl-pill>`);
    const pill = getPill(fixture.nativeElement);
    expect(getRemoveButton(pill)).toBeNull();
  });

  it('should toggle the remove button based on `nglPillRemovable`', () => {
    const fixture = createTestComponent(`<ngl-pill (nglPillRemove)="onRemove()" [nglPillRemovable]="removable"></ngl-pill>`);
    const pill = getPill(fixture.nativeElement);

    fixture.componentInstance.removable = false;
    fixture.detectChanges();
    expect(getRemoveButton(pill)).toBeNull();

    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    expect(getRemoveButton(pill)).not.toBeNull();
  });

  it('should trigger the remove event whenever the remove button is clicked', () => {
    const fixture = createTestComponent();
    const pill = getPill(fixture.nativeElement);
    const removeButton = getRemoveButton(pill);
    expect(fixture.componentInstance.onRemove).not.toHaveBeenCalled();
    removeButton.click();
    expect(fixture.componentInstance.onRemove).toHaveBeenCalled();
  });
});

@Component({
  template: `
    <ngl-pill (nglPillRemove)="onRemove()">
      <a>I am a pill!</a>
    </ngl-pill>
  `,
})
export class TestComponent {
  removable = true;
  onRemove = jasmine.createSpy('onRemove');
}
