/**
 * Testing helpers
 */
import {TestBed, ComponentFixture} from '@angular/core/testing';
import { NGL_CONFIG, NglConfig } from '../../lib/config/config';
import { element } from 'protractor';

// Default configuration for every TestComponent
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      NglConfig,
      {provide: NGL_CONFIG, useValue: null},
    ],
  });
});

export function dispatchKeyEvent(fixture: ComponentFixture<any>, predicate: any, key: string, indexOf: number = -1) {
  const { debugElement} = fixture;
  const _debugElement = indexOf > -1 ? debugElement.queryAll(predicate)[indexOf] : debugElement.query(predicate);
  const event = document.createEvent('KeyboardEvent');
  event.initEvent('', true, true);
  _debugElement.triggerEventHandler(key, event);
}

export function selectElements(element: HTMLElement, selector: string): HTMLElement[] {
  return [].slice.call(element.querySelectorAll(selector));
}

/**
 * IE11 doesn't support dispatching new Event directly -- must utilize document.createEvent method.
 */
export function dispatchEvent(el: HTMLElement, type: string, canBubble = true) {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent(type, canBubble, true);
  el.dispatchEvent(evt);
}

// Shortcut function for less boilerplate
export function createGenericTestComponent<T>(type: {new (...args: any[]): T}, html?: string, detectChanges = true): ComponentFixture<T> {
  if (html) {
    TestBed.overrideComponent(type, {set: {template: html}});
  }
  const fixture = TestBed.createComponent(type);
  if (detectChanges) {
    fixture.detectChanges();
  }
  return fixture as ComponentFixture<T>;
}

export function hasCssClass(el: HTMLElement | SVGElement | Element, cssClass: string): boolean {
  return (el.getAttribute('class') || '').split(' ').includes(cssClass);
}
