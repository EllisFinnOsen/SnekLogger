// ViewAllFeedingsList.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import ViewAllFeedingsList from "@/components/global/feedings/ViewAllFeedingsList";

// Mock react-redux's useSelector so we can control its output.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock FeedingsList so we can inspect the props passed to it.
jest.mock("@/components/global/feedings/FeedingsList", () => {
  const React = require("react");
  const { Text } = require("react-native");
  // This dummy component renders the JSON stringified props for inspection.
  return (props) => (
    <Text testID="feedings-list-mock">{JSON.stringify(props)}</Text>
  );
});

// Import useSelector so we can set its return value in our tests.
import { useSelector } from "react-redux";

describe("ViewAllFeedingsList", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passes the correct props to FeedingsList when feedings are present", () => {
    const mockFeedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
      { id: "2", feedingDate: "2025-01-02", feedingTime: "13:00", complete: 1 },
    ];
    // Set useSelector to return the mock feedings.
    useSelector.mockReturnValue(mockFeedings);

    const { getByTestId } = render(<ViewAllFeedingsList />);
    // Retrieve the rendered props from our dummy FeedingsList.
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    // Verify that the props passed to FeedingsList match what ViewAllFeedingsList sets.
    expect(passedProps.feedings).toEqual(mockFeedings);
    expect(passedProps.title).toBe("Upcoming Feedings");
    expect(passedProps.showAllLink).toBe(true);
    expect(passedProps.noFeedingsText).toBe("No upcoming feedings available");
  });

  it("passes the correct props to FeedingsList when no feedings are available", () => {
    // When no feedings are available, useSelector returns an empty array.
    useSelector.mockReturnValue([]);

    const { getByTestId } = render(<ViewAllFeedingsList />);
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    expect(passedProps.feedings).toEqual([]);
    expect(passedProps.title).toBe("Upcoming Feedings");
    expect(passedProps.showAllLink).toBe(true);
    expect(passedProps.noFeedingsText).toBe("No upcoming feedings available");
  });
});
