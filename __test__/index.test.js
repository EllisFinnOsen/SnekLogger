// index.test.js

// --- Mocks for native modules --- //

// Mock the expo module so that registerRootComponent is a mock function.
jest.mock("expo", () => ({
  registerRootComponent: jest.fn(),
}));

// Mock expo-sqlite so that its native functionality isn’t called during tests.
jest.mock("expo-sqlite", () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
  })),
}));

// (Do not inline mock expo-blur here; the manual mock in __mocks__ will be used.)

// --- End of native module mocks --- //

// Import the dependencies we need for our assertions.
import { registerRootComponent } from "expo";
import App from "@/App"; // Adjust the import path if necessary.

// Now, write the test suite for index.js.
describe("index.js", () => {
  beforeEach(() => {
    // Clear any previous calls before each test.
    jest.clearAllMocks();
  });

  it("calls registerRootComponent with App", () => {
    // Import the index file.
    // This will execute the module-level code, including calling registerRootComponent(App).
    require("../index"); // Adjust the relative path to your index.js file if needed.

    // Assert that registerRootComponent was called with the App component.
    expect(registerRootComponent).toHaveBeenCalledWith(App);
  });
});
