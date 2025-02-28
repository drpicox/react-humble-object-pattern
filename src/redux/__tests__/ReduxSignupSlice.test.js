// src/redux/__tests__/ReduxSignupSlice.test.js
import {
  setUsername,
  setPassword,
  validate,
  isStrongPassword,
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
        expect(isStrongPassword("Password123")).toBe(true);
      });

      test("requires minimum length of 8 characters", () => {
        expect(isStrongPassword("Pass123")).toBe(false);
      });

      test("requires at least one uppercase letter", () => {
        expect(isStrongPassword("password123")).toBe(false);
      });

      test("requires at least one number", () => {
        expect(isStrongPassword("Password")).toBe(false);
      });

      test("accepts password with special characters", () => {
        expect(isStrongPassword("Password123!@#")).toBe(true);
      });

      test("accepts very long passwords", () => {
        const longPassword = "Password123" + "a".repeat(100);
        expect(isStrongPassword(longPassword)).toBe(true);
      });
    });

    test("setPassword should update password state", () => {
      store.dispatch(setPassword("newpassword"));
      expect(selectPassword(store.getState())).toBe("newpassword");
    });

    test("handles empty password", () => {
      store.dispatch(setPassword(""));
      expect(isStrongPassword("")).toBe(false);
      store.dispatch(validate());
      expect(selectMessage(store.getState())).toBe("Invalid credentials");
    });

    test("handles whitespace-only password", () => {
      store.dispatch(setPassword("        "));
      expect(isStrongPassword("        ")).toBe(false);
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
      expect(isStrongPassword("Password123한글")).toBe(true);
    });
  });
});
