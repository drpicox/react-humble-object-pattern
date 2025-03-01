# React Testing Strategies Development Guide

## Overview
This project compares different testing approaches for React applications, focusing on the Humble Object pattern, controller pattern, and Redux implementation for improved testability and performance.

## Project Structure
- `/src/plain/` - Plain React implementation with controller pattern
- `/src/redux/` - Redux implementation of the same patterns

## Build and Test Commands
- Start dev server: `yarn start` or `npm start`
- Run all tests: `yarn test` or `npm test`
- Run specific test: `yarn test src/plain/components/__tests__/HumbleSignupForm.test.js` 
- Run tests in watch mode: `yarn test --watch`
- Build for production: `yarn build` or `npm run build`

## Code Style Guidelines
- **Architecture**: 
  - Plain implementation: Controller Pattern separates business logic
  - Redux implementation: Uses Redux slices and actions
- **Component Types**:
  - Humble components: UI-only with minimal logic, delegating to controllers/Redux
  - Smart components: React components with local state logic
- **File naming**: PascalCase for components and controllers, camelCase for hooks/utils
- **Imports**: Group React imports first, then external packages, then local imports
- **Testing**: 
  - Controller/Redux tests: Test business logic in isolation (111x faster)
  - Component tests: Use React Testing Library with userEvent for UI interactions
  - IMPORTANT: Never test internal methods directly (e.g., isStrongPassword)
  - For controller tests: Use controller.validate() + check controller.message
  - For Redux tests: Use store.dispatch(validate()) + check selectMessage(store.getState())
  - Run tests in CI mode: `CI=1 npm test [testfile]` to avoid interactive mode
- **Components**: Function components with hooks preferred over class components
- **Error handling**: Validate inputs in controllers/Redux, display messages in components