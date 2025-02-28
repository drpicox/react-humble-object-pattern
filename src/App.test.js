import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/React Testing Strategies/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders implementation options', () => {
  render(<App />);
  expect(screen.getByText(/Plain React/i)).toBeInTheDocument();
  expect(screen.getByText(/Redux/i)).toBeInTheDocument();
});

test('renders component type controls', () => {
  render(<App />);
  // Look for the h3 heading instead of labels that may appear multiple times
  const componentTypeHeading = screen.getByRole('heading', { name: /Component Type:/i });
  expect(componentTypeHeading).toBeInTheDocument();
  
  // Verify radio inputs exist
  const humbleRadio = screen.getByRole('radio', { name: /Humble Component/i });
  const smartRadio = screen.getByRole('radio', { name: /Smart Component/i });
  expect(humbleRadio).toBeInTheDocument();
  expect(smartRadio).toBeInTheDocument();
});
