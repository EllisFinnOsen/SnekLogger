// CollectionPetList.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import CollectionPetList from "@/components/global/pets/CollectionPetList";

// --- Remove Redux mocks since the component no longer uses Redux ---

// --- Mock GroupPetList ---
// We assume that GroupPetList is responsible for rendering the pet list for a group.
// For testing, we can simply have it render its props as JSON (with a testID for easy querying).
jest.mock("@/components/global/pets/GroupPetList", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return (props) => (
    <Text testID="group-pet-list">{JSON.stringify(props)}</Text>
  );
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
  it("renders 'No groups available' when groups is empty", () => {
    // Pass an empty groups array.
    const groups = [];
    const { getByText } = render(<CollectionPetList groups={groups} />);
    expect(getByText("No groups available")).toBeTruthy();
  });

  it("renders a GroupPetList for each group when groups are present", () => {
    const groups = [
      { id: "1", name: "Group One", pets: [{ id: "a", name: "Pet A" }] },
      { id: "2", name: "Group Two", pets: [] },
    ];

    const { getAllByTestId } = render(<CollectionPetList groups={groups} />);
    const groupLists = getAllByTestId("group-pet-list");
    expect(groupLists.length).toBe(groups.length);

    // Inspect the props passed to the first GroupPetList.
    // (Our mock renders the props as JSON inside the Text's children.)
    const firstProps = JSON.parse(groupLists[0].props.children);
    expect(firstProps.group).toEqual(groups[0]);
  });
});
