// src/redux/__tests__/ReduxSignupSlice.test.js
import signupReducer, { 
  setUsername, 
  setPassword, 
  validate, 
  isStrongPassword 
} from '../signupSlice';
import { configureSuiteTimer } from '../../utils/timeUtils';

describe('Redux Signup Slice', () => {
  // Configure timer for the entire test suite
  configureSuiteTimer('Redux Slice');
  
  let initialState;

  beforeEach(() => {
    initialState = {
      username: '',
      password: '',
      message: ''
    };
  });

  describe('Username validation', () => {
    test('setUsername should update username state', () => {
      const action = setUsername('john');
      const state = signupReducer(initialState, action);
      expect(state.username).toBe('john');
    });

    test('handles empty username', () => {
      const action = setUsername('');
      const state = signupReducer(initialState, action);
      const validateState = signupReducer(state, validate());
      expect(validateState.message).toBe('Invalid credentials');
    });

    test('handles whitespace-only username', () => {
      let state = signupReducer(initialState, setUsername('   '));
      state = signupReducer(state, validate());
      expect(state.message).toBe('Invalid credentials');
    });

    test('handles very long usernames', () => {
      const longUsername = 'a'.repeat(100);
      const state = signupReducer(initialState, setUsername(longUsername));
      expect(state.username).toBe(longUsername);
    });

    test('handles special characters in username', () => {
      const state = signupReducer(initialState, setUsername('user@123!'));
      expect(state.username).toBe('user@123!');
    });
  });

  describe('Password validation', () => {
    describe('Strong password requirements', () => {
      test('accepts valid strong password', () => {
        expect(isStrongPassword('Password123')).toBe(true);
      });

      test('requires minimum length of 8 characters', () => {
        expect(isStrongPassword('Pass123')).toBe(false);
      });

      test('requires at least one uppercase letter', () => {
        expect(isStrongPassword('password123')).toBe(false);
      });

      test('requires at least one number', () => {
        expect(isStrongPassword('Password')).toBe(false);
      });

      test('accepts password with special characters', () => {
        expect(isStrongPassword('Password123!@#')).toBe(true);
      });

      test('accepts very long passwords', () => {
        const longPassword = 'Password123' + 'a'.repeat(100);
        expect(isStrongPassword(longPassword)).toBe(true);
      });
    });

    test('setPassword should update password state', () => {
      const action = setPassword('newpassword');
      const state = signupReducer(initialState, action);
      expect(state.password).toBe('newpassword');
    });

    test('handles empty password', () => {
      const state = signupReducer(initialState, setPassword(''));
      expect(isStrongPassword('')).toBe(false);
      const validateState = signupReducer(state, validate());
      expect(validateState.message).toBe('Invalid credentials');
    });

    test('handles whitespace-only password', () => {
      const state = signupReducer(initialState, setPassword('        '));
      expect(isStrongPassword('        ')).toBe(false);
    });
  });

  describe('Form validation', () => {
    test('validate should set success message when credentials are valid', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Success!');
    });

    test('validate should set error message when only username is valid', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('weak'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });

    test('validate should set error message when only password is valid', () => {
      let state = signupReducer(initialState, setUsername(''));
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });

    test('validate should set error message when both credentials are invalid', () => {
      let state = signupReducer(initialState, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });

    test('validates form after fixing invalid data', () => {
      // First submit with invalid data
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('weak'));
      state = signupReducer(state, validate());
      expect(state.message).toBe('Invalid credentials');

      // Fix the password and resubmit
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, validate());
      expect(state.message).toBe('Success!');
    });

    test('maintains validation state after multiple validations', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('Password123'));
      
      // Validate multiple times
      state = signupReducer(state, validate());
      expect(state.message).toBe('Success!');
      
      state = signupReducer(state, validate());
      expect(state.message).toBe('Success!');
    });
  });

  describe('Edge cases', () => {
    test('handles rapid state changes', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, setUsername('jane'));
      state = signupReducer(state, setPassword('Password456'));
      state = signupReducer(state, validate());
      
      expect(state.username).toBe('jane');
      expect(state.password).toBe('Password456');
      expect(state.message).toBe('Success!');
    });

    test('handles unicode characters', () => {
      let state = signupReducer(initialState, setUsername('사용자'));
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, validate());
      expect(state.message).toBe('Success!');
    });

    test('handles password with mixed unicode and ascii', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('Password123한글'));
      expect(isStrongPassword('Password123한글')).toBe(true);
    });
  });
});