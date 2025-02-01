// HelloWave.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import { HelloWave } from "@/components/global/HelloWave";

// Mock react-native-reanimated using its provided mock
jest.mock("react-native-reanimated", () => {
  // Import the default mock provided by react-native-reanimated
  const Reanimated = require("react-native-reanimated/mock");

  // Override the call method if needed (no-op)
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe("HelloWave", () => {
  it("renders a waving emoji", () => {
    const { getByText } = render(<HelloWave />);
    const emojiElement = getByText("👋");
    expect(emojiElement).toBeTruthy();
  });

  // Optional: Snapshot test to capture the rendered output.
  it("matches the snapshot", () => {
    const { toJSON } = render(<HelloWave />);
    expect(toJSON()).toMatchSnapshot();
  });
});
