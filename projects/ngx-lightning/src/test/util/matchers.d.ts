declare module jasmine {
  interface Matchers<T> {
    toHaveCssClass(expected: string): boolean;
    toHaveText(expected: string): boolean;
  }
}
