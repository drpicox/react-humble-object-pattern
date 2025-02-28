// src/redux/signupSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  username: '',
  password: '',
  message: '',
};

// Create slice with reducers
export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    validate: (state) => {
      const isStrongPassword = 
        state.password.length >= 8 && 
        /[A-Z]/.test(state.password) && 
        /\d/.test(state.password);
      
      state.message = isStrongPassword && state.username.trim().length > 0
        ? 'Success!'
        : 'Invalid credentials';
    },
  },
});

// Export actions and reducer
export const { setUsername, setPassword, validate } = signupSlice.actions;
export default signupSlice.reducer;

// Selectors
export const selectUsername = (state) => state.signup.username;
export const selectPassword = (state) => state.signup.password;
export const selectMessage = (state) => state.signup.message;

// Helper function to check password strength - used in tests
export const isStrongPassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /\d/.test(password);
};