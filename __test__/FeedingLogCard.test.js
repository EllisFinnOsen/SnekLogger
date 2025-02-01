// FeedingLogCard.test.js
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import FeedingLogCard from "@/components/global/feedings/FeedingLogCard"; // Adjust the import as needed
import { updateFeedingInDb } from "@/database";
import { updateFeeding } from "@/redux/actions";

// ----- Mocks ----- //

// Mock navigation so we can track calls to navigate()
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock Redux dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

// Mock the database function for updating a feeding log
jest.mock("@/database", () => ({
  updateFeedingInDb: jest.fn(),
}));

// Mock the Redux action creator (so we can verify it was called with the correct payload)
jest.mock("@/redux/actions", () => ({
  updateFeeding: jest.fn((item) => ({ type: "UPDATE_FEEDING", payload: item })),
}));

// Mock theme colors so that we always get the same colors in our tests
jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn().mockImplementation((props, colorName) => {
    switch (colorName) {
      case "text":
        return "white";
      case "icon":
        return "red";
      case "field":
        return "grey";
      case "subtleText":
        return "lightgrey";
      case "active":
        return "blue";
      case "background":
        return "black";
      default:
        return "white";
    }
  }),
}));

// Mock date utility functions so that the formatted strings are predictable.
jest.mock("@/utils/dateUtils", () => ({
  toISODateTime: jest.fn((date, time) => new Date("2025-02-01T12:00:00Z")),
  formatDateString: jest.fn(() => "02/01"),
  formatTimeString: jest.fn(() => "12:00 PM"),
}));

// ----- Tests ----- //

describe("FeedingLogCard", () => {
  const sampleItemIncomplete = {
    id: 1,
    petId: 101,
    feedingDate: "2025-01-31",
    feedingTime: "12:00",
    complete: 0,
    petName: "Fido",
    preyType: "Kibble",
  };

  const sampleItemComplete = {
    ...sampleItemIncomplete,
    complete: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with an incomplete feeding log", () => {
    const { getByText, getByTestId } = render(
      <FeedingLogCard item={sampleItemIncomplete} />
    );

    // Verify that pet name, prey type, and formatted date/time are rendered.
    expect(getByText("Fido")).toBeTruthy();
    expect(getByText("Kibble")).toBeTruthy();
    expect(getByText("02/01")).toBeTruthy();
    expect(getByText("(12:00 PM)")).toBeTruthy();

    // Query the icon wrapper by its testID.
    const icon = getByTestId("feeding-log-icon");
    expect(icon.props.children.props.name).toBe("square-outline");
  });

  it("renders correctly with a complete feeding log", () => {
    const { getByTestId } = render(
      <FeedingLogCard item={sampleItemComplete} />
    );
    const icon = getByTestId("feeding-log-icon");
    expect(icon.props.children.props.name).toBe("checkbox");
  });

  it("navigates to the EditFeeding screen on main card press", () => {
    const { getByTestId } = render(
      <FeedingLogCard item={sampleItemIncomplete} />
    );
    const cardTouchable = getByTestId("feeding-log-card");
    fireEvent.press(cardTouchable);
    expect(mockNavigate).toHaveBeenCalledWith("EditFeeding", {
      feedingId: sampleItemIncomplete.id,
    });
  });

  it("toggles completion status when the checkbox toggle is pressed", async () => {
    // Simulate a successful database update.
    updateFeedingInDb.mockResolvedValueOnce();

    const { getByTestId } = render(
      <FeedingLogCard item={sampleItemIncomplete} />
    );
    const toggleButton = getByTestId("feeding-log-toggle");

    // Fire a press event with a synthetic event (including a dummy stopPropagation).
    fireEvent.press(toggleButton, { stopPropagation: () => {} });
    // Ensure that pressing the toggle does not trigger navigation.
    expect(mockNavigate).not.toHaveBeenCalled();

    // Wait for the asynchronous update to complete.
    await waitFor(() => {
      expect(updateFeedingInDb).toHaveBeenCalledWith(
        sampleItemIncomplete.id,
        sampleItemIncomplete.petId,
        sampleItemIncomplete.feedingDate,
        sampleItemIncomplete.feedingTime,
        1
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        updateFeeding({ ...sampleItemIncomplete, complete: 1 })
      );
    });

    // After toggling, the icon should update to "checkbox".
    const icon = getByTestId("feeding-log-icon");
    expect(icon.props.children.props.name).toBe("checkbox");
  });

  it("does not toggle the completion status when updateFeedingInDb fails", async () => {
    // Simulate a failure in the database update.
    updateFeedingInDb.mockRejectedValueOnce(new Error("DB error"));

    const { getByTestId } = render(
      <FeedingLogCard item={sampleItemIncomplete} />
    );
    const toggleButton = getByTestId("feeding-log-toggle");
    fireEvent.press(toggleButton, { stopPropagation: () => {} });

    await waitFor(() => {
      expect(updateFeedingInDb).toHaveBeenCalled();
    });

    // Since the update failed, the dispatch should not have been called.
    expect(mockDispatch).not.toHaveBeenCalled();
    const icon = getByTestId("feeding-log-icon");
    expect(icon.props.children.props.name).toBe("square-outline");
  });

  it("updates its internal checked state when the item.complete prop changes", () => {
    const { getByTestId, rerender } = render(
      <FeedingLogCard item={sampleItemIncomplete} />
    );
    let icon = getByTestId("feeding-log-icon");
    expect(icon.props.children.props.name).toBe("square-outline");

    // Re-render with the item marked as complete.
    rerender(<FeedingLogCard item={sampleItemComplete} />);
    icon = getByTestId("feeding-log-icon");
    expect(icon.props.children.props.name).toBe("checkbox");
  });
});
