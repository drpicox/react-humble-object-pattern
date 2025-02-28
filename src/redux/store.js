// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './controllers/SignupController';

const store = configureStore({
  reducer: {
    signup: signupReducer,
  },
});

export default store;