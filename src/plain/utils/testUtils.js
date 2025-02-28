// src/plain/utils/testUtils.js

export function createTestController(Controller) {
    const originalInstance = new Controller();
    const proxiedInstance = {};
    
    // Create notify spy
    proxiedInstance.notify = jest.fn();
    
    // Override original notify to trigger our spy
    originalInstance.notify = () => {
        proxiedInstance.notify();
    };
    
    // Copy initial properties from original instance
    Object.getOwnPropertyNames(originalInstance).forEach(function(prop) {
        if (typeof originalInstance[prop] !== 'function') {
            proxiedInstance[prop] = originalInstance[prop];
        }
    });
    
    // Copy all prototype methods to delegate to original instance
    Object.getOwnPropertyNames(Controller.prototype).forEach(function(methodName) {
        if (methodName !== 'constructor') {
            proxiedInstance[methodName] = function(...args) {
                const result = originalInstance[methodName].apply(originalInstance, args);
                
                // After each method call, sync all properties
                Object.getOwnPropertyNames(originalInstance).forEach(function(prop) {
                    if (typeof originalInstance[prop] !== 'function') {
                        proxiedInstance[prop] = originalInstance[prop];
                    }
                });
                
                return result;
            };
        }
    });

    return proxiedInstance;
}

// Helper for timing tests
export function startTimeMeasurement() {
  return process.hrtime();
}

export function endTimeMeasurement(start) {
  const diff = process.hrtime(start);
  const timeInMs = (diff[0] * 1e9 + diff[1]) / 1e6;
  return timeInMs;
}

export function logTestTime(testName, timeInMs) {
  console.log(`🕒 ${testName}: ${timeInMs.toFixed(2)}ms`);
}
