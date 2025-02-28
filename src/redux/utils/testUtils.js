// src/redux/utils/testUtils.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '../store';

// Import shared time measurement utilities
export { 
  startTimeMeasurement, 
  endTimeMeasurement, 
  logTestTime 
} from '../../utils/timeUtils';

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