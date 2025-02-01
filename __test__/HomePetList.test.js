// HomePetList.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomePetList from "@/components/global/pets/HomePetList";

// --- Mock useNavigation ---
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// --- Mock useSelector ---
import { useSelector } from "react-redux";
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// --- Set up a variable to capture PetList props ---
let dummyPetListProps = null;

// --- Mock PetList ---
jest.mock("@/components/global/pets/PetList", () => {
  const React = require("react");
  const { Text, TouchableOpacity } = require("react-native");
  return (props) => {
    // Store the received props in a module-level variable for inspection.
    dummyPetListProps = props;
    // Render a simple TouchableOpacity that displays the title and calls onShowAllPress on press.
    return (
      <TouchableOpacity testID="pet-list" onPress={props.onShowAllPress}>
        <Text>{props.title}</Text>
      </TouchableOpacity>
    );
  };
});

describe("HomePetList", () => {
  afterEach(() => {
    jest.clearAllMocks();
    dummyPetListProps = null;
  });

  it("renders correctly with the proper props", () => {
    // Simulate Redux state with some pets.
    const mockPets = [
      { id: "1", name: "Fido" },
      { id: "2", name: "Buddy" },
    ];
    const state = { pets: { pets: mockPets } };
    // Set useSelector to return what the selector callback returns.
    useSelector.mockImplementation((selector) => selector(state));

    render(<HomePetList />);

    // Now, dummyPetListProps should have been set by our mocked PetList.
    expect(dummyPetListProps).not.toBeNull();
    expect(dummyPetListProps.pets).toEqual(mockPets);
    expect(dummyPetListProps.title).toBe("Your Pets");
    expect(dummyPetListProps.showAllLink).toBe(true);
    expect(typeof dummyPetListProps.onShowAllPress).toBe("function");
  });

  it("navigates to 'Collection' when onShowAllPress is invoked", () => {
    // Simulate Redux state with some pets.
    const mockPets = [
      { id: "1", name: "Fido" },
      { id: "2", name: "Buddy" },
    ];
    const state = { pets: { pets: mockPets } };
    useSelector.mockImplementation((selector) => selector(state));

    // Render HomePetList. Our dummy PetList will store its props in dummyPetListProps.
    const { getByTestId } = render(<HomePetList />);

    // Retrieve the onShowAllPress callback from our dummy props.
    expect(dummyPetListProps).not.toBeNull();
    expect(typeof dummyPetListProps.onShowAllPress).toBe("function");

    // Simulate a press on the PetList (our dummy component) by querying its testID.
    const petListComponent = getByTestId("pet-list");
    fireEvent.press(petListComponent);

    expect(mockNavigate).toHaveBeenCalledWith("Collection");
  });
});
