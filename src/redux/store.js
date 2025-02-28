// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice';

export function createStore() {
  return configureStore({
    reducer: {
      signup: signupReducer,
    },
  });
}

const store = createStore();
export default store;