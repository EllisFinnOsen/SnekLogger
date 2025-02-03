// themedscrollview.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import { Text, StyleSheet } from "react-native";
import SimpleScrollView from "@/components/global/ThemedScrollView";

// --- Mock the hook from TabBarBackground --- //
jest.mock("@/components/global/TabBarBackground", () => ({
  useBottomTabOverflow: jest.fn(),
}));
import { useBottomTabOverflow } from "@/components/global/TabBarBackground";

// Optionally, if you haven’t set up a custom mock for react-native-reanimated, you can use its default mock:
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// A helper function to flatten styles (since StyleSheet.flatten may not be available)
const flattenStyle = (style) => {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...s }), {});
  }
  return style;
};

describe("SimpleScrollView", () => {
  beforeEach(() => {
    // Set a default return value for useBottomTabOverflow before each test.
    useBottomTabOverflow.mockReturnValue(20);
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <SimpleScrollView>
        <Text>Test Child</Text>
      </SimpleScrollView>
    );
    expect(getByText("Test Child")).toBeTruthy();
  });

  it("passes the bottom value to scrollIndicatorInsets and contentContainerStyle", () => {
    const bottomValue = 30;
    useBottomTabOverflow.mockReturnValue(bottomValue);
    const { getByTestId } = render(
      <SimpleScrollView testID="simple-scrollview">
        <Text>Content</Text>
      </SimpleScrollView>
    );
    const scrollView = getByTestId("simple-scrollview");

    // Assert that scrollIndicatorInsets is set correctly.
    expect(scrollView.props.scrollIndicatorInsets).toEqual({
      bottom: bottomValue,
    });

    // Flatten the contentContainerStyle before comparing.
    const flattenedStyle = flattenStyle(scrollView.props.contentContainerStyle);
    expect(flattenedStyle).toEqual({
      flexGrow: 1,
      paddingHorizontal: 32,
      paddingTop: 64,
      paddingBottom: bottomValue,
    });
  });
});
