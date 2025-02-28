// src/redux/utils/testUtils.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../store';

// Helper function to render components with Redux provider
export function renderWithRedux(
  ui,
  {
    initialState = {},
    store = createStore(),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
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