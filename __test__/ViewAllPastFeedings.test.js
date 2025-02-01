// ViewAllPastFeedings.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import ViewAllPastFeedings from "@/components/global/feedings/ViewAllPastFeedings";

// Mock react-redux's useSelector so we can control its output.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock FeedingsList so that we can inspect its props.
// We import React and Text inside the factory function to avoid out-of-scope errors.
jest.mock("@/components/global/feedings/FeedingsList", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return (props) => (
    <Text testID="feedings-list-mock">{JSON.stringify(props)}</Text>
  );
});

// Import useSelector so we can set its return value in our tests.
import { useSelector } from "react-redux";

describe("ViewAllPastFeedings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passes the correct props to FeedingsList when past feedings are present", () => {
    const mockFeedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
    ];
    // Set useSelector to return our mock past feedings.
    useSelector.mockReturnValue(mockFeedings);

    const { getByTestId } = render(<ViewAllPastFeedings />);
    // Retrieve the rendered props from our dummy FeedingsList.
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    // Verify that the props passed to FeedingsList match what ViewAllPastFeedings sets.
    expect(passedProps.feedings).toEqual(mockFeedings);
    expect(passedProps.title).toBe("Past Feedings");
    expect(passedProps.showAllLink).toBe(true);
    expect(passedProps.noFeedingsText).toBe("No past feedings available");
  });

  it("passes the correct props to FeedingsList when no past feedings are available", () => {
    // When no past feedings are available, useSelector returns an empty array.
    useSelector.mockReturnValue([]);

    const { getByTestId } = render(<ViewAllPastFeedings />);
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    expect(passedProps.feedings).toEqual([]);
    expect(passedProps.title).toBe("Past Feedings");
    expect(passedProps.showAllLink).toBe(true);
    expect(passedProps.noFeedingsText).toBe("No past feedings available");
  });
});
