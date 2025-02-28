// src/redux/components/__tests__/ReduxSignupForm.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import signupReducer from "../../signupSlice";
import { ReduxSignupForm } from "../ReduxSignupForm";
import { createStore } from "../../store";
import { configureSuiteTimer } from "../../../utils/timeUtils";

describe("ReduxSignupForm", () => {
  // Configure timer for the entire test suite
  configureSuiteTimer('Redux Component');

  const renderForm = () => {
    const store = createStore();
    
    return render(
      <Provider store={store}>
        <ReduxSignupForm />
      </Provider>
    );
  };

  describe("Initial render", () => {
    test("renders all form elements", () => {
      renderForm();

      expect(screen.getByLabelText("Username:")).toBeInTheDocument();
      expect(screen.getByLabelText("Password:")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    test("starts with empty fields", () => {
      renderForm();

      expect(screen.getByLabelText("Username:")).toHaveValue("");
      expect(screen.getByLabelText("Password:")).toHaveValue("");
      expect(screen.queryByText("Success!")).not.toBeInTheDocument();
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });

  describe("User interactions", () => {
    test("allows typing in username field", async () => {
      renderForm();
      const input = screen.getByLabelText("Username:");

      await userEvent.type(input, "john");
      expect(input).toHaveValue("john");
    });

    test("allows typing in password field", async () => {
      renderForm();
      const input = screen.getByLabelText("Password:");

      await userEvent.type(input, "Password123");
      expect(input).toHaveValue("Password123");
    });

    test("handles form submission with valid data", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");

      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
    });

    test("handles empty form submission", async () => {
      renderForm();
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("handles form submission with only username", async () => {
      renderForm();
      await userEvent.type(screen.getByLabelText("Username:"), "john");
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("handles form submission with only password", async () => {
      renderForm();
      await userEvent.type(screen.getByLabelText("Password:"), "Password123");
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });
  });

  describe("Validation feedback", () => {
    test("shows success message after fixing invalid submission", async () => {
      renderForm();

      // First submit with invalid data
      await userEvent.type(screen.getByLabelText("Username:"), "john");
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });

      // Fix the form and resubmit
      await userEvent.type(screen.getByLabelText("Password:"), "Password123");
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
    });

    test("updates message when switching between valid and invalid states", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");

      // Submit valid form
      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });

      // Clear username and resubmit
      await userEvent.clear(usernameInput);
      await userEvent.click(screen.getByText("Sign Up"));

      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });
  });
});