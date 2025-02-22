// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

let startTime;

beforeAll(function () {
  startTime = performance.now();
});

afterAll(function () {
  const stopTime = performance.now();
  const duration = stopTime - startTime;
  const suiteName =
    expect.getState().currentTestName?.split(" ›")[0].split(" ")[0] ||
    "Unknown";

  process.stdout.write(`\n🕒 ${suiteName}: ${duration.toFixed(2)}ms\n`);
});
