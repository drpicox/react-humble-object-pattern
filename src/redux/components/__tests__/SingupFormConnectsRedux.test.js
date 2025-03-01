// src/redux/components/__tests__/SingupFormConnectsRedux.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { ReduxSignupForm } from "../ReduxSignupForm";
import {
  setUsername,
  setPassword,
  selectUsername,
  selectPassword,
} from "../../signupSlice";
import { createStore } from "../../store";
import { configureSuiteTimer } from "../../../utils/timeUtils";

configureSuiteTimer("Redux Singup Component");

describe("ReduxSignupForm Component connects Redux", () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  const renderWithRedux = (component) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  test("renders the form with username and password from Redux state", () => {
    // Prepare the state of Redux to have a username and password
    store.dispatch(setUsername("testuser"));
    store.dispatch(setPassword("Password123"));

    renderWithRedux(<ReduxSignupForm />);

    // Verify that the form is rendered with the correct values
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("Password123");
  });

  test("updates username and password in Redux store when inputs change", () => {
    renderWithRedux(<ReduxSignupForm />);

    // Find the input fields and change their values
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "NewPassword123" } });

    // Verify that the values are updated in the Redux store
    const state = store.getState();
    expect(selectUsername(state)).toBe("newuser");
    expect(selectPassword(state)).toBe("NewPassword123");
  });

  test("displays validation message from Redux when form is submitted", () => {
    // Prepare the state of Redux to have a username and password
    store.dispatch(setUsername("validuser"));
    store.dispatch(setPassword("Password123"));
    store.dispatch({ type: "signup/validate" });

    renderWithRedux(<ReduxSignupForm />);

    // Find the submit button and click it
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });
});
