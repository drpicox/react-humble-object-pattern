// src/utils/timeUtils.js

/**
 * Starts a high-resolution time measurement
 * @returns {[number, number]} hrtime tuple from process.hrtime()
 */
export function startTimeMeasurement() {
  return process.hrtime();
}

/**
 * Ends a time measurement and calculates elapsed time in milliseconds
 * @param {[number, number]} start - The start time from startTimeMeasurement()
 * @returns {number} The elapsed time in milliseconds
 */
export function endTimeMeasurement(start) {
  const diff = process.hrtime(start);
  const timeInMs = (diff[0] * 1e9 + diff[1]) / 1e6;
  return timeInMs;
}

/**
 * Logs test execution time to the console
 * @param {string} testName - The name of the test or test suite
 * @param {number} timeInMs - The execution time in milliseconds
 */
export function logTestTime(testName, timeInMs) {
  console.log(`🕒 ${testName}: ${timeInMs.toFixed(2)}ms`);
}

/**
 * Configure timing hooks for a Jest test suite
 * This should be called at the top level of a describe block to time the entire test file
 * @param {string} suiteName - The name of the test suite for logging
 */
export function configureSuiteTimer(suiteName) {
  let startTime;
  
  // Run once before all tests in the suite
  beforeAll(() => {
    startTime = startTimeMeasurement();
  });
  
  // Run once after all tests in the suite
  afterAll(() => {
    const testTime = endTimeMeasurement(startTime);
    logTestTime(suiteName, testTime);
  });
}