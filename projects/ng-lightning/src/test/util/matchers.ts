function toHaveCssClass() {
  return {compare: buildError(false), negativeCompare: buildError(true)};

  function buildError(isNot: boolean) {
    return function(actual: HTMLElement, className: string) {
      return {
        pass: actual.classList.contains(className) === !isNot,
        get message() {
          return `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
        },
      };
    };
  }
}

function toHaveText() {
  return {compare: buildError(false), negativeCompare: buildError(true)};

  function buildError(isNot: boolean) {
    return function(actual: HTMLElement, expectedText: string) {
      const actualText = actual.textContent;
      return {
        pass: (actualText === expectedText) === !isNot,
        get message() {
          return `Expected "${actualText}" ${isNot ? 'not ' : ''}to be equal to "${expectedText}"`;
        },
      };
    };
  }
}

beforeEach(() => {
  jasmine.addMatchers({
    toHaveCssClass,
    toHaveText,
  });
});
