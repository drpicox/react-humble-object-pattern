// src/redux/components/__tests__/ReduxSignupForm.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { ReduxSignupForm } from "../ReduxSignupForm";
import { createStore } from "../../store";
import { configureSuiteTimer } from "../../../utils/timeUtils";

describe("ReduxSignupForm", () => {
  // Configure timer for the entire test suite
  configureSuiteTimer("Redux Component");

  const renderForm = () => {
    const store = createStore();

    return render(
      <Provider store={store}>
        <ReduxSignupForm />
      </Provider>
    );
  };

  describe("Username validation", () => {
    test("sets username and updates state", async () => {
      renderForm();
      const input = screen.getByLabelText("Username:");

      await userEvent.type(input, "john");
      expect(input).toHaveValue("john");
    });

    test("handles empty username", async () => {
      renderForm();
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("handles whitespace-only username", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "   ");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("handles very long usernames", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const longString = "a".repeat(100);
      
      await userEvent.type(usernameInput, longString);
      expect(usernameInput).toHaveValue(longString);
    });

    test("handles special characters in username", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      
      await userEvent.type(usernameInput, "user@123!");
      expect(usernameInput).toHaveValue("user@123!");
    });
  });

  describe("Password validation", () => {
    describe("Strong password requirements", () => {
      test("accepts valid strong password", async () => {
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

      test("requires minimum length of 8 characters", async () => {
        renderForm();
        const usernameInput = screen.getByLabelText("Username:");
        const passwordInput = screen.getByLabelText("Password:");
        
        await userEvent.type(usernameInput, "john");
        await userEvent.type(passwordInput, "Pass1");
        await userEvent.click(screen.getByText("Sign Up"));
        
        await waitFor(() => {
          expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });
      });

      test("requires at least one uppercase letter", async () => {
        renderForm();
        const usernameInput = screen.getByLabelText("Username:");
        const passwordInput = screen.getByLabelText("Password:");
        
        await userEvent.type(usernameInput, "john");
        await userEvent.type(passwordInput, "password123");
        await userEvent.click(screen.getByText("Sign Up"));
        
        await waitFor(() => {
          expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });
      });

      test("requires at least one number", async () => {
        renderForm();
        const usernameInput = screen.getByLabelText("Username:");
        const passwordInput = screen.getByLabelText("Password:");
        
        await userEvent.type(usernameInput, "john");
        await userEvent.type(passwordInput, "Password");
        await userEvent.click(screen.getByText("Sign Up"));
        
        await waitFor(() => {
          expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });
      });

      test("accepts password with special characters", async () => {
        renderForm();
        const usernameInput = screen.getByLabelText("Username:");
        const passwordInput = screen.getByLabelText("Password:");
        
        await userEvent.type(usernameInput, "john");
        await userEvent.type(passwordInput, "Password123!@#");
        await userEvent.click(screen.getByText("Sign Up"));
        
        await waitFor(() => {
          expect(screen.getByText("Success!")).toBeInTheDocument();
        });
      });

      test("accepts very long passwords", async () => {
        renderForm();
        const usernameInput = screen.getByLabelText("Username:");
        const passwordInput = screen.getByLabelText("Password:");
        const longPassword = "Password123" + "a".repeat(50);
        
        await userEvent.type(usernameInput, "john");
        await userEvent.type(passwordInput, longPassword);
        await userEvent.click(screen.getByText("Sign Up"));
        
        await waitFor(() => {
          expect(screen.getByText("Success!")).toBeInTheDocument();
        });
      });
    });

    test("updates state when password changes", async () => {
      renderForm();
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(passwordInput, "newpassword");
      expect(passwordInput).toHaveValue("newpassword");
    });

    test("handles empty password", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      
      await userEvent.type(usernameInput, "john");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("handles whitespace-only password", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "        ");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });
  });

  describe("Form validation", () => {
    test("success message when credentials are valid", async () => {
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

    test("error message when only username is valid", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "weak");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("error message when only password is valid", async () => {
      renderForm();
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("error message when both credentials are invalid", async () => {
      renderForm();
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
    });

    test("validates form after fixing invalid data", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      // First submit with invalid data
      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "weak");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      });
      
      // Fix the password and resubmit
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
    });

    test("maintains validation state after multiple validates", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "Password123");
      
      // Validate multiple times
      await userEvent.click(screen.getByText("Sign Up"));
      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByText("Sign Up"));
      expect(screen.getByText("Success!")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    test("handles rapid state changes", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "john");
      await userEvent.clear(usernameInput);
      await userEvent.type(usernameInput, "jane");
      
      await userEvent.type(passwordInput, "Password123");
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, "Password456");
      
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
    });

    test("handles unicode characters", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "사용자");
      await userEvent.type(passwordInput, "Password123");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
    });

    test("handles password with mixed unicode and ascii", async () => {
      renderForm();
      const usernameInput = screen.getByLabelText("Username:");
      const passwordInput = screen.getByLabelText("Password:");
      
      await userEvent.type(usernameInput, "john");
      await userEvent.type(passwordInput, "Password123한글");
      await userEvent.click(screen.getByText("Sign Up"));
      
      await waitFor(() => {
        expect(screen.getByText("Success!")).toBeInTheDocument();
      });
    });
  });
});
