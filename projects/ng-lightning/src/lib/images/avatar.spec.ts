import {TestBed, ComponentFixture}  from '@angular/core/testing';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../../test/util/helpers';
import {NglImagesModule} from './module';

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
    expect(avatar).toHaveCssClass('slds-avatar--rectangle');
    expect(avatar).toHaveCssClass('slds-avatar--medium');
    expect(avatar).toHaveCssClass('slds-avatar');
    expect(avatar).toHaveCssClass('custom-class');
  });

  it('should change the type of the avatar element based on input', () => {
    const fixture = createTestComponent(`<ngl-avatar [type]="type" src="image1.jpg" [ngClass]="{'custom-class': true}"></ngl-avatar>`);
    const avatar = getAvatarElement(fixture.nativeElement);

    expect(avatar).toHaveCssClass('slds-avatar--circle');
    expect(avatar).toHaveCssClass('custom-class');

    fixture.componentInstance.type = 'rectangle';
    fixture.detectChanges();
    expect(avatar).toHaveCssClass('slds-avatar--rectangle');
    expect(avatar).not.toHaveCssClass('slds-avatar--circle');
    expect(avatar).toHaveCssClass('custom-class');
  });

  it('should change the size of the avatar element based on input', () => {
    const fixture = createTestComponent(`<ngl-avatar [size]="size" src="image1.jpg"></ngl-avatar>`);
    const avatar = getAvatarElement(fixture.nativeElement);

    expect(avatar).toHaveCssClass('slds-avatar--small');
    expect(avatar).not.toHaveCssClass('slds-avatar--large');
    expect(avatar).not.toHaveCssClass('slds-avatar--x-small');
    expect(avatar).not.toHaveCssClass('slds-avatar--medium');

    fixture.componentInstance.size = 'large';
    fixture.detectChanges();
    expect(avatar).toHaveCssClass('slds-avatar--large');
    expect(avatar).not.toHaveCssClass('slds-avatar--small');
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
