jest.mock("expo-font", () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock("@expo/vector-icons", () => {
  return {
    Ionicons: jest.fn(() => null),
  };
});
