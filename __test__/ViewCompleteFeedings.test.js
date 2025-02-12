// ViewAllCompleteFeedings.test.js
import React from "react";
import { render } from "@testing-library/react-native";
import ViewCompleteFeedings from "@/components/global/feedings/ViewCompleteFeedings";

// Mock react-redux's useSelector so we can control its output.
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock FeedingsList to render its props as JSON inside a <Text>
jest.mock("@/components/global/feedings/FeedingsList", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return (props) => (
    <Text testID="feedings-list-mock">{JSON.stringify(props)}</Text>
  );
});

import { useSelector } from "react-redux";

describe("ViewCompleteFeedings", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passes the correct props to FeedingsList when complete feedings are present", () => {
    const mockFeedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
      { id: "2", feedingDate: "2025-01-02", feedingTime: "13:00", complete: 1 },
    ];
    useSelector.mockReturnValue(mockFeedings);

    const { getByTestId } = render(<ViewCompleteFeedings />);
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    expect(passedProps.feedings).toEqual(mockFeedings);
    expect(passedProps.title).toBe("Complete Feedings");
    expect(passedProps.showAllLink).toBe(true);
    expect(passedProps.noFeedingsText).toBe("No Complete feedings available");
  });

  it("passes the correct props to FeedingsList when no complete feedings are available", () => {
    useSelector.mockReturnValue([]);

    const { getByTestId } = render(<ViewCompleteFeedings />);
    const propsText = getByTestId("feedings-list-mock").props.children;
    const passedProps = JSON.parse(propsText);

    expect(passedProps.feedings).toEqual([]);
    expect(passedProps.title).toBe("Complete Feedings");
    expect(passedProps.showAllLink).toBe(true);
    expect(passedProps.noFeedingsText).toBe("No Complete feedings available");
  });
});
