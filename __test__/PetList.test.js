// PetList.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PetList from "@/components/global/pets/PetList";

// --- Mocks ---

// Mock useNavigation to capture navigation calls.
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock ThemedView to simply render a plain View with its children.
jest.mock("@/components/global/ThemedView", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ThemedView: (props) => <View {...props}>{props.children}</View>,
  };
});

// Mock ThemedText to simply render a plain Text with its children.
jest.mock("@/components/global/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: (props) => <Text {...props}>{props.children}</Text>,
  };
});

// Mock PrimaryPetCard to render a Text element with testID "primary-pet-card".
jest.mock("@/components/global/pets/PrimaryPetCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return (props) => (
    <Text testID="primary-pet-card">{JSON.stringify(props)}</Text>
  );
});

// Mock AddPetCard to render a Text element with testID "add-pet-card".
jest.mock("@/components/global/pets/AddPetCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return () => <Text testID="add-pet-card">Add Pet Card</Text>;
});

describe("PetList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the add pet card when no pets are available", () => {
    // Since the new design no longer renders the fallback text,
    // we expect the AddPetCard to be rendered instead.
    const { getByTestId, queryByText } = render(
      <PetList pets={[]} noPetsText="No pets available" />
    );
    expect(getByTestId("add-pet-card")).toBeTruthy();
    // Optionally, you could assert that the fallback text is not present:
    expect(queryByText("No pets available")).toBeNull();
  });

  it("renders header with title and 'View all' link, and renders pet cards and the AddPetCard", () => {
    const pets = [
      { id: "1", name: "Pet 1" },
      { id: "2", name: "Pet 2" },
    ];

    const { getByText, getAllByTestId, getByTestId } = render(
      <PetList
        pets={pets}
        title="My Pets"
        showAllLink={true}
        showAllText="View all"
        noPetsText="No pets available"
        // Provide a dummy onShowAllPress to ensure it's used.
        onShowAllPress={() => {}}
      />
    );

    // Check that the header title is rendered.
    expect(getByText("My Pets")).toBeTruthy();
    // Check that the "View all" link is rendered.
    expect(getByText("View all")).toBeTruthy();
    // Check that PrimaryPetCard is rendered for each pet.
    const primaryCards = getAllByTestId("primary-pet-card");
    expect(primaryCards.length).toBe(pets.length);
    // Check that the AddPetCard is rendered.
    expect(getByTestId("add-pet-card")).toBeTruthy();
  });

  it("calls custom onShowAllPress when provided and 'View all' is pressed", () => {
    const onShowAllPressMock = jest.fn();
    const pets = [{ id: "1", name: "Pet 1" }];
    const { getByText } = render(
      <PetList
        pets={pets}
        title="My Pets"
        showAllLink={true}
        showAllText="View all"
        noPetsText="No pets available"
        onShowAllPress={onShowAllPressMock}
      />
    );

    const showAllLink = getByText("View all");
    fireEvent.press(showAllLink);
    expect(onShowAllPressMock).toHaveBeenCalled();
  });

  it("navigates to GroupScreen with groupId when onShowAllPress is not provided and groupId is provided", () => {
    const pets = [{ id: "1", name: "Pet 1" }];
    const groupId = "group1";
    const { getByText } = render(
      <PetList
        pets={pets}
        title="My Pets"
        showAllLink={true}
        showAllText="View all"
        noPetsText="No pets available"
        groupId={groupId}
      />
    );

    const showAllLink = getByText("View all");
    fireEvent.press(showAllLink);
    expect(mockNavigate).toHaveBeenCalledWith("GroupScreen", { groupId });
  });
});
