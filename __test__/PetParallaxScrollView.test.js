// PetParallaxScrollView.test.js
import React from "react";
import { Text, ImageBackground } from "react-native";
import { render, queryByTestId } from "@testing-library/react-native";

// --- Mocks ---

// Use the default reanimated mock and add a dummy for useScrollViewOffset.
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.useScrollViewOffset = () => ({ value: 0 });
  return Reanimated;
});

// Mock checkImageURL to control its return value.
jest.mock("@/utils/checkImage", () => ({
  checkImageURL: jest.fn(),
}));

// Mock useColorScheme to return "light".
jest.mock("@/hooks/useColorScheme", () => ({
  __esModule: true,
  default: () => "light",
}));

// Mock useBottomTabOverflow to return 20.
jest.mock("@/components/global/TabBarBackground", () => ({
  useBottomTabOverflow: () => 20,
}));

// Mock ThemedView to simply render a native View.
jest.mock("@/components/global/ThemedView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ThemedView: (props) => <View {...props}>{props.children}</View>,
  };
});

// Mock ThemedText to simply render a native Text.
jest.mock("@/components/global/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: (props) => <Text {...props}>{props.children}</Text>,
  };
});

// Now import the component.
import PetParallaxScrollView from "@/components/global/pets/pet_profile/PetParallaxScrollView";
import { checkImageURL } from "@/utils/checkImage";

const defaultProps = {
  headerImageSrc: "http://example.com/image.jpg",
  headerBackgroundColor: { light: "#ffffff", dark: "#000000" },
  petName: "Fluffy",
  petBirthdate: "Jan 1, 2020",
  petMorph: "Golden",
};

describe("PetParallaxScrollView", () => {
  const childText = "Child Content";

  it("renders an ImageBackground header when checkImageURL returns true", () => {
    checkImageURL.mockReturnValue(true);

    const { getByText, getByTestId } = render(
      <PetParallaxScrollView {...defaultProps}>
        <Text testID="child">{childText}</Text>
      </PetParallaxScrollView>
    );

    // Verify pet details and child content.
    expect(getByText("Fluffy")).toBeTruthy();
    expect(getByText("Jan 1, 2020")).toBeTruthy();
    expect(getByText("Golden")).toBeTruthy();
    expect(getByText(childText)).toBeTruthy();

    // Verify that an ImageBackground is rendered with the correct source.
    const imageBg = getByTestId("header-image");
    expect(imageBg).toBeTruthy();
    expect(imageBg.props.source.uri).toBe(defaultProps.headerImageSrc);
  });

  it("renders fallback header when checkImageURL returns false", () => {
    checkImageURL.mockReturnValue(false);

    const { getByText, queryByTestId } = render(
      <PetParallaxScrollView {...defaultProps}>
        <Text testID="child">{childText}</Text>
      </PetParallaxScrollView>
    );

    // Verify pet details and child content.
    expect(getByText("Fluffy")).toBeTruthy();
    expect(getByText("Jan 1, 2020")).toBeTruthy();
    expect(getByText("Golden")).toBeTruthy();
    expect(getByText(childText)).toBeTruthy();

    // In fallback mode, the header should not include an ImageBackground.
    const imageBg = queryByTestId("header-image");
    expect(imageBg).toBeNull();
  });
});
