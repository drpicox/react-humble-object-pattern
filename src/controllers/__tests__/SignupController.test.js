// src/controllers/__tests__/SignupController.test.js
import { SignupController } from '../SignupController';
import { createTestController } from '../../utils/testUtils';

describe('SignupController', () => {
    let controller;

    beforeEach(() => {
        controller = createTestController(SignupController);
    });

    describe('Username validation', () => {
        test('sets username and notifies on change', () => {
            controller.setUsername('john');
            expect(controller.username).toBe('john');
            expect(controller.notify).toHaveBeenCalled();
        });

        test('handles empty username', () => {
            controller.setUsername('');
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');
            expect(controller.notify).toHaveBeenCalledTimes(2);
        });

        test('handles whitespace-only username', () => {
            controller.setUsername('   ');
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');
        });

        test('handles very long usernames', () => {
            const longUsername = 'a'.repeat(100);
            controller.setUsername(longUsername);
            expect(controller.username).toBe(longUsername);
        });

        test('handles special characters in username', () => {
            controller.setUsername('user@123!');
            expect(controller.username).toBe('user@123!');
        });
    });

    describe('Password validation', () => {
        describe('Strong password requirements', () => {
            test('accepts valid strong password', () => {
                controller.setPassword('Password123');
                expect(controller.isStrongPassword()).toBe(true);
            });

            test('requires minimum length of 8 characters', () => {
                controller.setPassword('Pass123');  // 7 characters
                expect(controller.isStrongPassword()).toBe(false);
            });

            test('requires at least one uppercase letter', () => {
                controller.setPassword('password123');
                expect(controller.isStrongPassword()).toBe(false);
            });

            test('requires at least one number', () => {
                controller.setPassword('Password');
                expect(controller.isStrongPassword()).toBe(false);
            });

            test('accepts password with special characters', () => {
                controller.setPassword('Password123!@#');
                expect(controller.isStrongPassword()).toBe(true);
            });

            test('accepts very long passwords', () => {
                const longPassword = 'Password123' + 'a'.repeat(100);
                controller.setPassword(longPassword);
                expect(controller.isStrongPassword()).toBe(true);
            });
        });

        test('notifies on password change', () => {
            controller.setPassword('newpassword');
            expect(controller.notify).toHaveBeenCalled();
        });

        test('handles empty password', () => {
            controller.setPassword('');
            expect(controller.isStrongPassword()).toBe(false);
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');
        });

        test('handles whitespace-only password', () => {
            controller.setPassword('        ');
            expect(controller.isStrongPassword()).toBe(false);
        });
    });

    describe('Form validation', () => {
        test('validates successful form submission', () => {
            controller.setUsername('john');
            controller.setPassword('Password123');
            controller.validate();
            expect(controller.message).toBe('Success!');
            expect(controller.notify).toHaveBeenCalledTimes(3); // username + password + validate
        });

        test('invalidates when only username is valid', () => {
            controller.setUsername('john');
            controller.setPassword('weak');
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');
        });

        test('invalidates when only password is valid', () => {
            controller.setUsername('');
            controller.setPassword('Password123');
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');
        });

        test('invalidates when both fields are empty', () => {
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');
        });

        test('validates form after fixing invalid data', () => {
            // First submit with invalid data
            controller.setUsername('john');
            controller.setPassword('weak');
            controller.validate();
            expect(controller.message).toBe('Invalid credentials');

            // Fix the password and resubmit
            controller.setPassword('Password123');
            controller.validate();
            expect(controller.message).toBe('Success!');
        });

        test('maintains validation state after multiple validations', () => {
            controller.setUsername('john');
            controller.setPassword('Password123');
            
            // Validate multiple times
            controller.validate();
            expect(controller.message).toBe('Success!');
            
            controller.validate();
            expect(controller.message).toBe('Success!');
        });
    });

    describe('Edge cases', () => {
        test('handles rapid state changes', () => {
            controller.setUsername('john');
            controller.setPassword('Password123');
            controller.setUsername('jane');
            controller.setPassword('Password456');
            controller.validate();
            
            expect(controller.username).toBe('jane');
            expect(controller.password).toBe('Password456');
            expect(controller.message).toBe('Success!');
        });

        test('handles unicode characters', () => {
            controller.setUsername('사용자');
            controller.setPassword('Password123');
            controller.validate();
            expect(controller.message).toBe('Success!');
        });

        test('handles password with mixed unicode and ascii', () => {
            controller.setUsername('john');
            controller.setPassword('Password123한글');
            expect(controller.isStrongPassword()).toBe(true);
        });
    });
});
