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

test('renders component type options', () => {
  render(<App />);
  expect(screen.getByText(/Humble Component/i)).toBeInTheDocument();
  expect(screen.getByText(/Smart Component/i)).toBeInTheDocument();
});
