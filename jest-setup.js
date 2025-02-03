if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (callback, ...args) => setTimeout(callback, 0, ...args);
}

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock("@expo/vector-icons", () => {
  return {
    Ionicons: jest.fn(() => null),
  };
});
