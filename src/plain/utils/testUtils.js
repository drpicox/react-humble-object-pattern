// src/plain/utils/testUtils.js

// Import shared time measurement utilities
export { 
  startTimeMeasurement, 
  endTimeMeasurement, 
  logTestTime 
} from '../../utils/timeUtils';

/**
 * Creates a test controller with spies for testing
 * @param {Class} Controller - The controller class to create a test instance of
 * @returns {Object} A proxied controller instance with spies
 */
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
