// src/redux/controllers/__tests__/SignupController.test.js
import signupReducer, { 
  setUsername, 
  setPassword, 
  validate, 
  isStrongPassword 
} from '../SignupController';

describe('SignupController', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      username: '',
      password: '',
      message: ''
    };
  });

  describe('Actions and reducers', () => {
    test('setUsername should update username state', () => {
      const action = setUsername('john');
      const state = signupReducer(initialState, action);
      expect(state.username).toBe('john');
    });

    test('setPassword should update password state', () => {
      const action = setPassword('Password123');
      const state = signupReducer(initialState, action);
      expect(state.password).toBe('Password123');
    });

    test('validate should set success message when credentials are valid', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Success!');
    });

    test('validate should set error message when username is empty', () => {
      let state = signupReducer(initialState, setPassword('Password123'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });

    test('validate should set error message when password is invalid', () => {
      let state = signupReducer(initialState, setUsername('john'));
      state = signupReducer(state, setPassword('weak'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });

    test('validate should set error message when both credentials are invalid', () => {
      let state = signupReducer(initialState, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });
  });

  describe('isStrongPassword', () => {
    test('should return true for strong passwords', () => {
      expect(isStrongPassword('Password123')).toBe(true);
      expect(isStrongPassword('StrongP4ssword')).toBe(true);
      expect(isStrongPassword('1SuperSecret')).toBe(true);
    });

    test('should return false for passwords that are too short', () => {
      expect(isStrongPassword('Pass1')).toBe(false);
    });

    test('should return false for passwords without uppercase letters', () => {
      expect(isStrongPassword('password123')).toBe(false);
    });

    test('should return false for passwords without numbers', () => {
      expect(isStrongPassword('PasswordOnly')).toBe(false);
    });

    test('should return false for empty passwords', () => {
      expect(isStrongPassword('')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    test('handles whitespace-only usernames', () => {
      let state = signupReducer(initialState, setUsername('   '));
      state = signupReducer(state, setPassword('Password123'));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Invalid credentials');
    });

    test('handles very long usernames and passwords', () => {
      const longString = 'a'.repeat(100);
      
      let state = signupReducer(initialState, setUsername(longString));
      state = signupReducer(state, setPassword('Password123' + longString));
      state = signupReducer(state, validate());
      
      expect(state.message).toBe('Success!');
    });
  });
});