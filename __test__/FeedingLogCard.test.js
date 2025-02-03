// FeedingLogCard.test.js
import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import FeedingLogCard from "@/components/global/feedings/FeedingLogCard";
import { updateFeedingInDb } from "@/database";
import { updateFeeding } from "@/redux/actions";

// ----- Mocks ----- //

// --- Navigation ---
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// --- Redux ---
// Create a sample state that includes a pet with id 101.
const sampleState = {
  pets: {
    pets: [
      {
        id: 101,
        name: "Fido",
        imageURL: "https://example.com/fido.jpg",
      },
    ],
  },
};

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest
    .fn()
    .mockImplementation((selector) => selector(sampleState)),
}));

// --- Database ---
jest.mock("@/database", () => ({
  updateFeedingInDb: jest.fn(),
}));

// --- Redux Actions ---
jest.mock("@/redux/actions", () => ({
  updateFeeding: jest.fn((item) => ({ type: "UPDATE_FEEDING", payload: item })),
}));

// --- Theme Colors ---
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
      case "fieldAccent":
        return "orange";
      case "error":
        return "pink";
      case "errorSubtle":
        return "lightpink";
      default:
        return "white";
    }
  }),
}));

// --- Date Utils ---
jest.mock("@/utils/dateUtils", () => ({
  toISODateTime: jest.fn((date, time) => new Date("2025-02-01T12:00:00Z")),
  formatDateString: jest.fn(() => "02/01"),
  formatTimeString: jest.fn(() => "12:00 PM"),
}));

// --- Vector Icons ---
// Correctly import Text inside the mock factory.
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props) => <Text testID={props.testID}>{props.name}</Text>,
  };
});

// ----- Tests -----
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
    // Disable animations in tests by passing animateOnChange={false}
    const { getByText, getByTestId } = render(
      <FeedingLogCard
        item={sampleItemIncomplete}
        animateOnChange={false}
        isVisible={true}
      />
    );

    // Verify that the pet name, prey type, and formatted date/time are rendered.
    expect(getByText("Fido")).toBeTruthy();
    expect(getByText("Kibble")).toBeTruthy();
    expect(getByText("02/01")).toBeTruthy();
    expect(getByText("(12:00 PM)")).toBeTruthy();

    // Query the icon by its testID.
    const icon = getByTestId("feeding-log-icon");
    // For an incomplete feeding, the icon should show "square-outline".
    expect(icon.props.children).toBe("square-outline");
  });

  it("renders correctly with a complete feeding log", () => {
    const { getByTestId } = render(
      <FeedingLogCard
        item={sampleItemComplete}
        animateOnChange={false}
        isVisible={true}
      />
    );
    const icon = getByTestId("feeding-log-icon");
    // For a complete feeding, the icon should show "checkbox".
    expect(icon.props.children).toBe("checkbox");
  });

  it("navigates to the EditFeeding screen on main card press", () => {
    const { getByTestId } = render(
      <FeedingLogCard
        item={sampleItemIncomplete}
        animateOnChange={false}
        isVisible={true}
      />
    );
    const cardTouchable = getByTestId("feeding-log-card");
    act(() => {
      fireEvent.press(cardTouchable);
    });
    expect(mockNavigate).toHaveBeenCalledWith("EditFeeding", {
      feedingId: sampleItemIncomplete.id,
    });
  });

  it("toggles completion status when the checkbox toggle is pressed", async () => {
    // Simulate a successful database update.
    updateFeedingInDb.mockResolvedValueOnce();

    const { getByTestId } = render(
      <FeedingLogCard
        item={sampleItemIncomplete}
        animateOnChange={false}
        isVisible={true}
      />
    );
    const toggleButton = getByTestId("feeding-log-toggle");

    // Fire the press event and wait for updates.
    await act(async () => {
      fireEvent.press(toggleButton, { stopPropagation: () => {} });
    });
    expect(mockNavigate).not.toHaveBeenCalled();

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

    const icon = getByTestId("feeding-log-icon");
    expect(icon.props.children).toBe("checkbox");
  });

  it("does not toggle the completion status when updateFeedingInDb fails", async () => {
    // Simulate a failure in the database update.
    updateFeedingInDb.mockRejectedValueOnce(new Error("DB error"));

    const { getByTestId } = render(
      <FeedingLogCard
        item={sampleItemIncomplete}
        animateOnChange={false}
        isVisible={true}
      />
    );
    const toggleButton = getByTestId("feeding-log-toggle");

    await act(async () => {
      fireEvent.press(toggleButton, { stopPropagation: () => {} });
    });

    await waitFor(() => {
      expect(updateFeedingInDb).toHaveBeenCalled();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    const icon = getByTestId("feeding-log-icon");
    expect(icon.props.children).toBe("square-outline");
  });

  it("updates its internal checked state when the item.complete prop changes", () => {
    const { getByTestId, rerender } = render(
      <FeedingLogCard
        item={sampleItemIncomplete}
        animateOnChange={false}
        isVisible={true}
      />
    );
    let icon = getByTestId("feeding-log-icon");
    expect(icon.props.children).toBe("square-outline");

    // Re-render with the item marked as complete.
    rerender(
      <FeedingLogCard
        item={sampleItemComplete}
        animateOnChange={false}
        isVisible={true}
      />
    );
    icon = getByTestId("feeding-log-icon");
    expect(icon.props.children).toBe("checkbox");
  });
});
