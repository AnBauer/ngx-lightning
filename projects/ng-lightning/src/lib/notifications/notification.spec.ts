import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { createGenericTestComponent, hasCssClass } from '../../test/util/helpers';
import { NglNotificationsModule } from './module';

const createTestComponent = (html?: string, detectChanges?: boolean) =>
  createGenericTestComponent(TestComponent, html, detectChanges) as ComponentFixture<TestComponent>;

function getCloseButton(fixture: any): HTMLElement {
  return fixture.nativeElement.querySelector('button');
}

describe('`nglNotification`', () => {

  beforeEach(() => TestBed.configureTestingModule({declarations: [TestComponent], imports: [NglNotificationsModule]}));

  it('should have the proper classes and attributes', () => {
    const fixture = createTestComponent();
    const notificationElement = fixture.nativeElement.querySelector('.slds-notify');

    expect(notificationElement.getAttribute('role')).toBe('alert');

    fixture.componentInstance.type = 'toast';
    fixture.componentInstance.severity = 'error';
    fixture.detectChanges();

    expect(hasCssClass(notificationElement, 'slds-notify--toast')).toBeTruthy();
    expect(hasCssClass(notificationElement, 'slds-theme--error')).toBeTruthy();

    fixture.componentInstance.type = 'alert';
    fixture.componentInstance.severity = null;
    fixture.detectChanges();

    expect(hasCssClass(notificationElement, 'slds-notify--alert')).toBeTruthy();
    expect(hasCssClass(notificationElement, 'slds-theme--error')).toBeFalsy();

    const closeButton = getCloseButton(fixture);
    expect(hasCssClass(closeButton, 'slds-notify__close')).toBeTruthy();
  });

  it('should have the proper assistive texts', () => {
    const fixture = createTestComponent();
    fixture.componentInstance.assistiveText = 'Test of assistive text';
    fixture.componentInstance.closeAssistiveText = 'Test of close assistive text';
    fixture.detectChanges();

    const assistiveTexts = fixture.nativeElement.querySelectorAll('.slds-assistive-text');
    expect(assistiveTexts.length).toBe(2);
    expect(assistiveTexts[0].textContent).toBe(fixture.componentInstance.assistiveText);
    expect(assistiveTexts[1].textContent).toBe(fixture.componentInstance.closeAssistiveText);
  });

  it('should not have a close button when the nglNotificationClose attribute is absent', () => {
    const fixture = createTestComponent('<ngl-notification [type]="type" [severity]="severity">');
    const closeButton = getCloseButton(fixture);
    expect(closeButton).toBeFalsy();
  });

  it('should emit a close event when the close button is clicked', () => {
    const fixture = createTestComponent();
    const closeButton = getCloseButton(fixture);
    closeButton.click();
    expect(fixture.componentInstance.onClose).toHaveBeenCalledWith('button');
  });

  it('should emit a close event when its `close` method is called', () => {
    const fixture = createTestComponent();
    const externalCloseButton = fixture.nativeElement.querySelector('.boundVarCloser');
    externalCloseButton.click();
    expect(fixture.componentInstance.onClose).toHaveBeenCalledWith('api');
  });

  it('should emit a close event when the specified timeout has passed', fakeAsync(() => {
    const fixture = createTestComponent();
    fixture.componentInstance.timeout = 500;
    fixture.detectChanges();

    tick(400);
    expect(fixture.componentInstance.onClose).not.toHaveBeenCalled();

    tick(100);
    expect(fixture.componentInstance.onClose).toHaveBeenCalledWith('timeout');
    fixture.destroy();
  }));

  it('should set the timeout anew when the binding changes', fakeAsync(() => {
    const fixture = createTestComponent(null, false);
    fixture.componentInstance.timeout = 500;
    fixture.detectChanges();

    tick(400);
    fixture.componentInstance.timeout = 300;
    fixture.detectChanges();

    tick(299);
    expect(fixture.componentInstance.onClose).not.toHaveBeenCalled();

    tick(10);
    expect(fixture.componentInstance.onClose).toHaveBeenCalledWith('timeout');
    fixture.destroy();
  }));

  it('should cancel the active timeout after the close button has been clicked', fakeAsync(() => {
    const fixture = createTestComponent(null, false);
    fixture.componentInstance.timeout = 500;
    fixture.detectChanges();

    tick(400);
    getCloseButton(fixture).click();

    tick(100);
    expect(fixture.componentInstance.onClose).toHaveBeenCalledWith('button');
    expect(fixture.componentInstance.onClose).not.toHaveBeenCalledWith('timeout');
    fixture.destroy();
  }));

  it('should cancel timeout if destroyed', fakeAsync(() => {
    const fixture = createTestComponent(`<ngl-notification *ngIf="severity" timeout="1000" (nglNotificationClose)="onClose($event)"></ngl-notification>`);

    fixture.componentInstance.severity = null;
    fixture.detectChanges();
  }));

});


@Component({
  template: `
    <ngl-notification [type]="type" [severity]="severity" (nglNotificationClose)="onClose($event)"
      [assistiveText]="assistiveText" [closeAssistiveText]="closeAssistiveText"
      [timeout]="timeout"
      #notification="nglNotification">
      <h2>Base System Alert</h2>
    </ngl-notification>
    <button type="button" (click)="notification.close('api')" class="boundVarCloser"></button>
  `,
})
export class TestComponent {
  type = 'toast';
  severity = 'error';
  assistiveText: string;
  closeAssistiveText: string;
  timeout: any = null;
  onClose = jasmine.createSpy('onClose');
}
