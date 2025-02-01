// CollectionPetList.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import CollectionPetList from "@/components/global/pets/CollectionPetList";

// --- Mock react-redux hooks ---
import { useSelector, useDispatch } from "react-redux";
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// --- Mock actions ---
import { fetchGroups, fetchPetsByGroupId } from "@/redux/actions";
jest.mock("@/redux/actions", () => ({
  fetchGroups: jest.fn(() => ({ type: "FETCH_GROUPS" })),
  fetchPetsByGroupId: jest.fn((groupId) => ({
    type: "FETCH_PETS_BY_GROUP_ID",
    payload: groupId,
  })),
}));

// --- Mock PetList ---
jest.mock("@/components/global/pets/PetList", () => {
  const React = require("react");
  const { Text } = require("react-native");
  // This dummy component renders its props as JSON inside a Text element for inspection.
  return (props) => <Text testID="pet-list">{JSON.stringify(props)}</Text>;
});

// --- Mock ThemedView ---
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

describe("CollectionPetList", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  it("renders 'No groups available' when groups is empty", () => {
    // Simulate state with empty groups.
    const state = { groups: [], groupPets: {} };
    useSelector.mockImplementation((selector) => selector(state));

    const { getByText } = render(<CollectionPetList />);
    expect(getByText("No groups available")).toBeTruthy();
  });

  it("dispatches fetchGroups on mount and fetches pets for each group when groups are present", () => {
    const groups = [
      { id: "1", name: "Group One" },
      { id: "2", name: "Group Two" },
    ];
    const groupPets = { 1: [{ id: "a", name: "Pet A" }], 2: [] };
    const state = { groups, groupPets };
    useSelector.mockImplementation((selector) => selector(state));

    render(<CollectionPetList />);

    // Expect fetchGroups is dispatched.
    expect(mockDispatch).toHaveBeenCalledWith(fetchGroups());
    // For each group, expect fetchPetsByGroupId is dispatched.
    groups.forEach((group) => {
      expect(mockDispatch).toHaveBeenCalledWith(fetchPetsByGroupId(group.id));
    });
  });

  it("renders a PetList for each group when groups are present", () => {
    const groups = [
      { id: "1", name: "Group One" },
      { id: "2", name: "Group Two" },
    ];
    const groupPets = {
      1: [{ id: "a", name: "Pet A" }],
      2: [
        { id: "b", name: "Pet B" },
        { id: "c", name: "Pet C" },
      ],
    };
    const state = { groups, groupPets };
    useSelector.mockImplementation((selector) => selector(state));

    const { getAllByTestId } = render(<CollectionPetList />);
    const petLists = getAllByTestId("pet-list");
    expect(petLists.length).toBe(groups.length);

    // Inspect the props passed to the first PetList.
    const firstProps = JSON.parse(petLists[0].props.children);
    expect(firstProps.pets).toEqual(groupPets["1"]);
    expect(firstProps.title).toBe("Group One");
    expect(firstProps.groupId).toBe("1");
    expect(firstProps.noPetsText).toBe("No pets available in Group One");
    expect(firstProps.showAllLink).toBe(true);
  });
});
