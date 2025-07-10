import { test, expect } from "vitest";

function someMethod(a: number) {
  return 2 * a;
}

test(`someMethod should return 8 given a is 4`, () => {
  expect(someMethod(4)).toBe(8);
});
