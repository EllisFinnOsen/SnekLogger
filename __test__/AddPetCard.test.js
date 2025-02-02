import React from "react";
import { render, fireEvent, within } from "@testing-library/react-native";
import AddPetCard from "@/components/global/pets/AddPetCard";

// --- Mock @expo/vector-icons ---
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  // We create a dummy Ionicons component that renders a <Text> with the provided props.
  return {
    Ionicons: (props) => <Text testID={props.testID}>{props.name}</Text>,
  };
});

// --- Mock useThemeColor ---
jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn().mockImplementation((props, colorName) => {
    switch (colorName) {
      case "icon":
        return "blue";
      case "subtleText":
        return "gray";
      case "field":
        return "white";
      default:
        return "black";
    }
  }),
}));

// --- Mock ThemedView ---
// Make ThemedView a simple wrapper that renders its children.
jest.mock("@/components/global/ThemedView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ThemedView: (props) => <View {...props}>{props.children}</View>,
  };
});

// --- Mock ThemedText ---
// Make ThemedText a simple wrapper that renders its children.
jest.mock("@/components/global/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: (props) => <Text {...props}>{props.children}</Text>,
  };
});

// --- Mock expo-image-picker ---
// Ensure the mock is used.
jest.mock("expo-image-picker");

describe("AddPetCard", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<AddPetCard />);
    expect(getByTestId("add-pet-card")).toBeTruthy();
  });

  // Add more tests as needed
});
