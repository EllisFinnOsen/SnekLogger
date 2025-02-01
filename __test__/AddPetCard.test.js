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

// --- Mock useNavigation ---
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

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
jest.mock("@/components/global/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: (props) => <Text {...props}>{props.children}</Text>,
  };
});

describe("AddPetCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with the proper text and icon", () => {
    const { getByText, getByTestId } = render(<AddPetCard />);

    // Verify that the text "Add New Pet" is rendered.
    expect(getByText("Add New Pet")).toBeTruthy();

    // Get the card container.
    const card = getByTestId("add-pet-card");

    // Use 'within' to search inside the card for the icon.
    // Our mocked Ionicons renders a <Text> whose content is the icon name.
    const icon = within(card).getByTestId("add-pet-icon");
    expect(icon.props.children).toBe("add-circle-outline");
    // Although our mock doesn't render a "color" prop visibly,
    // you can also check that useThemeColor was called appropriately (if needed).
  });

  it("navigates to AddPetScreen when pressed", () => {
    const { getByTestId } = render(<AddPetCard />);
    const card = getByTestId("add-pet-card");

    fireEvent.press(card);

    expect(mockNavigate).toHaveBeenCalledWith("AddPetScreen");
  });
});
