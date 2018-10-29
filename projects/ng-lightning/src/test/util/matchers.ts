import Matchers = jasmine.Matchers;

export interface NgMatchers extends Matchers<any> {
  not: NgMatchers;
  toHaveCssClass(expected: {[k: string]: string}|string): boolean;
}

function cssClassCompare(isNot: boolean) {
  return function (actual: HTMLElement, className: string) {
    return {
      pass: actual.classList.contains(className) === !isNot,
      get message() {
        return `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
      }
    };
  };
}

function haveTextCompare(isNot: boolean) {
  return function (actual: HTMLElement, expectedText: string) {
    const actualText = actual.textContent;
    return {
      pass: (actualText === expectedText) === !isNot,
      get message() {
        return `Expected "${actualText}" ${isNot ? 'not ' : ''}to be equal to "${expectedText}"`;
      }
    };
  };
}


export const customMatchers: jasmine.CustomMatcherFactories = {
  // Here is our custom matcher; cloned from @angular/core
  toHaveCssClass: () => ({
    compare        : cssClassCompare(false),
    negativeCompare: cssClassCompare(true)
  }),

  toHaveText: () => ({
    compare        : haveTextCompare(false),
    negativeCompare: haveTextCompare(true)
  })
};
