// src/redux/__tests__/ReduxSignupSlice.test.js
import {
  setUsername,
  setPassword,
  validate,
  selectUsername,
  selectPassword,
  selectMessage,
} from "../signupSlice";
import { createStore } from "../store";
import { configureSuiteTimer } from "../../utils/timeUtils";

configureSuiteTimer("Redux Signup Slice");

describe("Redux Signup Slice", () => {
  // Configure timer for the entire test suite
  let store;

  beforeEach(() => {
    // Create a fresh store instance for each test
    store = createStore();
  });

  describe("Username validation", () => {
    test("setUsername should update username state", () => {
      store.dispatch(setUsername("john"));
      expect(selectUsername(store.getState())).toBe("john");
    });

    test("handles empty username", () => {
      store.dispatch(setUsername(""));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("handles whitespace-only username", () => {
      store.dispatch(setUsername("   "));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("handles very long usernames", () => {
      const longUsername = "a".repeat(100);
      store.dispatch(setUsername(longUsername));
      expect(selectUsername(store.getState())).toBe(longUsername);
    });

    test("handles special characters in username", () => {
      store.dispatch(setUsername("user@123!"));
      expect(selectUsername(store.getState())).toBe("user@123!");
    });
  });

  describe("Password validation", () => {
    describe("Strong password requirements", () => {
      test("accepts valid strong password", () => {
        store.dispatch(setUsername("john"));
        store.dispatch(setPassword("Password123"));
        store.dispatch(validate());
        expect(selectMessage(store.getState())).toBe("Success!");
      });

      test("requires minimum length of 8 characters", () => {
        store.dispatch(setUsername("john"));
        store.dispatch(setPassword("Pass123")); // 7 characters
        store.dispatch(validate());
        expect(selectMessage(store.getState())).toBe("Invalid credentials");
      });

      test("requires at least one uppercase letter", () => {
        store.dispatch(setUsername("john"));
        store.dispatch(setPassword("password123"));
        store.dispatch(validate());
        expect(selectMessage(store.getState())).toBe("Invalid credentials");
      });

      test("requires at least one number", () => {
        store.dispatch(setUsername("john"));
        store.dispatch(setPassword("Password"));
        store.dispatch(validate());
        expect(selectMessage(store.getState())).toBe("Invalid credentials");
      });

      test("accepts password with special characters", () => {
        store.dispatch(setUsername("john"));
        store.dispatch(setPassword("Password123!@#"));
        store.dispatch(validate());
        expect(selectMessage(store.getState())).toBe("Success!");
      });

      test("accepts very long passwords", () => {
        store.dispatch(setUsername("john"));
        const longPassword = "Password123" + "a".repeat(100);
        store.dispatch(setPassword(longPassword));
        store.dispatch(validate());
        expect(selectMessage(store.getState())).toBe("Success!");
      });
    });

    test("setPassword should update password state", () => {
      store.dispatch(setPassword("newpassword"));
      expect(selectPassword(store.getState())).toBe("newpassword");
    });

    test("handles empty password", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword(""));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("handles whitespace-only password", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("        "));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });
  });

  describe("Form validation", () => {
    test("validate should set success message when credentials are valid", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("Password123"));
      store.dispatch(validate());

      expect(selectMessage(store.getState())).toBe("Success!");
    });

    test("validate should set error message when only username is valid", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("weak"));
      store.dispatch(validate());

      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("validate should set error message when only password is valid", () => {
      store.dispatch(setUsername(""));
      store.dispatch(setPassword("Password123"));
      store.dispatch(validate());

      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("validate should set error message when both credentials are invalid", () => {
      store.dispatch(validate());

      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("validates form after fixing invalid data", () => {
      // First submit with invalid data
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("weak"));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Invalid credentials");

      // Fix the password and resubmit
      store.dispatch(setPassword("Password123"));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Success!");
    });

    test("maintains validation state after multiple validations", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("Password123"));

      // Validate multiple times
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Success!");

      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Success!");
    });
  });

  describe("Edge cases", () => {
    test("handles rapid state changes", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("Password123"));
      store.dispatch(setUsername("jane"));
      store.dispatch(setPassword("Password456"));
      store.dispatch(validate());

      expect(selectUsername(store.getState())).toBe("jane");
      expect(selectPassword(store.getState())).toBe("Password456");
      expect(selectMessage(store.getState())).toBe("Success!");
    });

    test("handles unicode characters", () => {
      store.dispatch(setUsername("사용자"));
      store.dispatch(setPassword("Password123"));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Success!");
    });

    test("handles password with mixed unicode and ascii", () => {
      store.dispatch(setUsername("john"));
      store.dispatch(setPassword("Password123한글"));
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Success!");
    });
  });
});
