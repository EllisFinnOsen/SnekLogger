import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import FeedingsList from "@/components/global/feedings/FeedingsList";

// Mock FeedingLogCard for easier testing.
jest.mock("@/components/global/feedings/FeedingLogCard", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return ({ item }) => (
    <Text testID="feeding-log-card">Feeding: {item.id}</Text>
  );
});

describe("FeedingsList", () => {
  it("renders fallback text when feedings is empty", async () => {
    const customFallback = "No feedings available";
    const { getByText } = render(
      <FeedingsList feedings={[]} noFeedingsText={customFallback} />
    );

    // Wait until the fallback text appears (i.e. loading is done)
    await waitFor(() => getByText(customFallback));
    expect(getByText(customFallback)).toBeTruthy();
  });

  it("renders header with title when provided", async () => {
    const title = "Recent Feedings";
    const feedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
    ];
    const { getByText, queryByText } = render(
      <FeedingsList feedings={feedings} title={title} />
    );

    await waitFor(() => getByText(title));
    expect(getByText(title)).toBeTruthy();
    // "Show all" should not be rendered if showAllLink is false.
    expect(queryByText("Show all")).toBeNull();
  });

  it("renders header with 'Show all' link when showAllLink is true", async () => {
    const feedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
    ];
    const { getByText } = render(
      <FeedingsList feedings={feedings} showAllLink={true} />
    );

    await waitFor(() => getByText("Show all"));
    expect(getByText("Show all")).toBeTruthy();
  });

  it("renders feeding cards for each feeding in the list", async () => {
    const feedings = [
      { id: "1", feedingDate: "2025-01-01", feedingTime: "12:00", complete: 0 },
      { id: "2", feedingDate: "2025-01-02", feedingTime: "13:00", complete: 1 },
    ];
    const { getAllByTestId } = render(<FeedingsList feedings={feedings} />);

    await waitFor(() => {
      expect(getAllByTestId("feeding-log-card").length).toBe(feedings.length);
    });
  });
});
