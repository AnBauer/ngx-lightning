import { ElementRef, Renderer2 } from '@angular/core';

export function toBoolean(value: any): boolean {
  switch (value) {
    case '':
      return true;

    case 'false':
    case '0':
      return false;

    default:
      return !!value;
  }
}

// Check if given value is integer. Cast strings as potential integers as well.
// See: http://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
export function isInt(value: any): boolean {
  if (isNaN(value)) {
    return false;
  }

  const x = parseFloat(value);
  /* tslint:disable:no-bitwise */
  return (x | 0) === x;
  /* tslint:enable:no-bitwise */
}

// Similar to `lodash.isobject`
export function isObject(value: any): boolean {
  const type = typeof value;
  return !!value && (type === 'object' || type === 'function');
}

// Generate a unique id (unique within the entire client session).
// Useful for temporary DOM ids.
let idCounter = 0;

export function uniqueId(prefix = 'uid') {
  return `ngl_${prefix}_${++idCounter}`;
}

export interface IReplaceClass {
  renderer: Renderer2;
  element: ElementRef;
}

export function replaceClass(instance: IReplaceClass, oldClass: string | string[], newClass?: string | string[]) {
  if (oldClass && oldClass !== newClass) {
    setClass(instance, oldClass, false);
  }
  if (newClass) {
    setClass(instance, newClass, true);
  }
}

function setClass(instance: IReplaceClass, klasses: string | string[], isAdd: boolean) {
  if (klasses) {
    (Array.isArray(klasses) ? klasses : [klasses]).forEach(k => {
      instance.renderer[isAdd ? 'addClass' : 'removeClass'](instance.element.nativeElement, k);
    });
  }
}
