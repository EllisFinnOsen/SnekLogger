// TabBarBackground.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import BlurTabBarBackground, {
  useBottomTabOverflow,
} from "@/components/global/TabBarBackground.ios";

// Mock dependencies for the hook
jest.mock("@react-navigation/bottom-tabs", () => ({
  useBottomTabBarHeight: () => 20, // Return a fixed value for testing
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 20 }), // Return a fixed bottom inset
}));

describe("BlurTabBarBackground", () => {
  it("renders correctly and matches the snapshot", () => {
    const { toJSON } = render(<BlurTabBarBackground />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe("useBottomTabOverflow", () => {
  // Create a simple test component that calls the hook and renders its value inside a <Text>.
  const HookTester = () => {
    const value = useBottomTabOverflow();
    return <Text>{value}</Text>;
  };

  it("returns 0 when tab bar height equals safe area bottom", () => {
    const { getByText } = render(<HookTester />);
    expect(getByText("0")).toBeTruthy();
  });
});
