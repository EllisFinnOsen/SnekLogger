// ViewPetProfileFeedings.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import ViewPetProfileFeedings from "@/components/global/feedings/ViewPetProfileFeedings";

// Mock react-redux's useSelector so we can control its output.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock FeedingsList so we can inspect the props passed to it.
jest.mock("@/components/global/feedings/FeedingsList", () => {
  const React = require("react");
  const { Text } = require("react-native");
  // This dummy component renders a JSON string of its received props for inspection.
  return (props) => (
    <Text testID="feedings-list-mock">{JSON.stringify(props)}</Text>
  );
});

import { useSelector } from "react-redux";

describe("ViewPetProfileFeedings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passes the correct props to FeedingsList when feedings are available", () => {
    const mockFeedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
      { id: "2", feedingDate: "2025-01-02", feedingTime: "13:00", complete: 1 },
    ];
    // Simulate that the selector returns the mock feedings.
    useSelector.mockReturnValue(mockFeedings);

    // Render the component with a given petId.
    const { getByTestId } = render(<ViewPetProfileFeedings petId="123" />);
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    expect(passedProps.feedings).toEqual(mockFeedings);
    expect(passedProps.noFeedingsText).toBe(
      "No feedings available for this pet."
    );
  });

  it("passes the correct props to FeedingsList when no feedings are available", () => {
    // Simulate that no feedings are available.
    useSelector.mockReturnValue([]);

    const { getByTestId } = render(<ViewPetProfileFeedings petId="123" />);
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    expect(passedProps.feedings).toEqual([]);
    expect(passedProps.noFeedingsText).toBe(
      "No feedings available for this pet."
    );
  });
});
