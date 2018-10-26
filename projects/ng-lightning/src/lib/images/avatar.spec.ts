import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglImagesModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getAvatarElement(element: Element): HTMLElement {
  return <HTMLElement>element.firstElementChild;
}

function getImageElement(element: Element): HTMLImageElement {
  return <HTMLImageElement>element.querySelector('img');
}

describe('Avatar Component', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglImagesModule]}));

  it('should render the avatar element with default classes', () => {
    const fixture = createTestComponent(`<ngl-avatar src="image1.jpg" class="custom-class"></ngl-avatar>`);
    const avatar = getAvatarElement(fixture.nativeElement);
    const image = getImageElement(avatar);
    expect(image.getAttribute('src')).toBe('image1.jpg');
    expect(hasCssClass(avatar, 'slds-avatar--rectangle')).toBeTruthy();
    expect(hasCssClass(avatar, 'slds-avatar--medium')).toBeTruthy();
    expect(hasCssClass(avatar, 'slds-avatar')).toBeTruthy();
    expect(hasCssClass(avatar, 'custom-class')).toBeTruthy();
  });

  it('should change the type of the avatar element based on input', () => {
    const fixture = createTestComponent(`<ngl-avatar [type]="type" src="image1.jpg" [ngClass]="{'custom-class': true}"></ngl-avatar>`);
    const avatar = getAvatarElement(fixture.nativeElement);

    expect(hasCssClass(avatar, 'slds-avatar--circle')).toBeTruthy();
    expect(hasCssClass(avatar, 'custom-class')).toBeTruthy();

    fixture.componentInstance.type = 'rectangle';
    fixture.detectChanges();
    expect(hasCssClass(avatar, 'slds-avatar--rectangle')).toBeTruthy();
    expect(hasCssClass(avatar, 'slds-avatar--circle')).toBeFalsy();
    expect(hasCssClass(avatar, 'custom-class')).toBeTruthy();
  });

  it('should change the size of the avatar element based on input', () => {
    const fixture = createTestComponent(`<ngl-avatar [size]="size" src="image1.jpg"></ngl-avatar>`);
    const avatar = getAvatarElement(fixture.nativeElement);

    expect(hasCssClass(avatar, 'slds-avatar--small')).toBeTruthy();
    expect(hasCssClass(avatar, 'slds-avatar--large')).toBeFalsy();
    expect(hasCssClass(avatar, 'slds-avatar--x-small')).toBeFalsy();
    expect(hasCssClass(avatar, 'slds-avatar--medium')).toBeFalsy();

    fixture.componentInstance.size = 'large';
    fixture.detectChanges();
    expect(hasCssClass(avatar, 'slds-avatar--large')).toBeTruthy();
    expect(hasCssClass(avatar, 'slds-avatar--small')).toBeFalsy();
  });

  it('should render the avatar element with assistive text', () => {
    const fixture = createTestComponent(`<ngl-avatar alt="assistive text" src="image1.jpg"></ngl-avatar>`);
    const avatar = getAvatarElement(fixture.nativeElement);
    const image = getImageElement(avatar);
    expect(image.getAttribute('alt')).toEqual('assistive text');
  });
});


@Component({ template: `` })
export class TestComponent {
  type: string = 'circle';
  size: string = 'small';
}
