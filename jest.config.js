module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest-setup.js",
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@expo|expo|expo-font|@unimodules|unimodules|sentry-expo|native-base)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^expo-blur$": "<rootDir>/__mocks__/expo-blur.js",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/jest.setup.js",
    "!**/babel.config.js",
    "!**/metro.config.js",
  ],
  coverageReporters: ["text", "lcov"],
};
