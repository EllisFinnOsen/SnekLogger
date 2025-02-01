// FeedingsList.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FeedingsList from "@/components/global/feedings/FeedingsList";

// Mock FeedingLogCard so that we can easily identify its rendering.
// Note that we import React and require Text inside the factory function.
jest.mock("@/components/global/feedings/FeedingLogCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ item }) => (
    <Text testID="feeding-log-card">Feeding: {item.id}</Text>
  );
});

describe("FeedingsList", () => {
  it("renders fallback text when feedings is empty", () => {
    const customFallback = "No feedings available";
    const { getByText } = render(
      <FeedingsList feedings={[]} noFeedingsText={customFallback} />
    );
    expect(getByText(customFallback)).toBeTruthy();
  });

  it("renders header with title when provided", () => {
    const title = "Recent Feedings";
    // Provide at least one feeding so that the fallback case is not used.
    const feedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
    ];
    const { getByText, queryByText } = render(
      <FeedingsList feedings={feedings} title={title} />
    );
    // Header should render the title.
    expect(getByText(title)).toBeTruthy();
    // And if showAllLink is not true, "Show all" should not be rendered.
    expect(queryByText("Show all")).toBeNull();
  });

  it("renders header with 'Show all' link when showAllLink is true", () => {
    const feedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
    ];
    const { getByText } = render(
      <FeedingsList feedings={feedings} showAllLink={true} />
    );
    // Check that the "Show all" text is rendered.
    expect(getByText("Show all")).toBeTruthy();
  });

  it("renders feeding cards for each feeding in the list", () => {
    const feedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
      { id: "2", feedingDate: "2025-01-02", feedingTime: "13:00", complete: 1 },
    ];
    const { getAllByTestId } = render(<FeedingsList feedings={feedings} />);
    // Our mocked FeedingLogCard renders a Text with testID "feeding-log-card".
    const cards = getAllByTestId("feeding-log-card");
    expect(cards.length).toBe(feedings.length);
  });
});
