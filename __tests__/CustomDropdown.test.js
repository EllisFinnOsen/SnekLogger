import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react-native";

import CustomDropdown from "@/components/global/CustomDropdown";
import { useThemeColor } from "@/hooks/useThemeColor";

// Mock the useThemeColor hook
jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(),
}));

// Mock data
const items = [
  { label: "Item 1", value: 1, imageURL: "https://example.com/image1.jpg" },
  { label: "Item 2", value: 2, imageURL: "https://example.com/image2.jpg" },
];

describe("CustomDropdown", () => {
  beforeEach(() => {
    // Mock the return values of useThemeColor
    useThemeColor.mockImplementation((props, colorName) => {
      switch (colorName) {
        case "text":
          return "#000000";
        case "field":
          return "#ffffff";
        case "bgColor":
          return "#f0f0f0";
        default:
          return "#000000";
      }
    });
  });

  test("renders CustomDropdown and selects an item", async () => {
    const onValueChange = jest.fn();
    const { getByTestId, queryByText } = render(
      <CustomDropdown
        items={items}
        selectedValue={1}
        onValueChange={onValueChange}
      />
    );

    // Open the dropdown
    fireEvent.press(getByTestId("dropdown-button"));

    // Wait for the modal to appear
    await waitFor(() => expect(getByTestId("dropdown-modal")).toBeTruthy());

    // Get modal content specifically
    const modal = getByTestId("dropdown-modal");

    // Ensure items exist inside the modal
    expect(within(modal).getByText("Item 1")).toBeTruthy();
    expect(within(modal).getByText("Item 2")).toBeTruthy();

    // Select an item
    fireEvent.press(within(modal).getByText("Item 2"));

    // Check if the onValueChange function was called with the correct value
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  test("closes the modal without selecting an item", async () => {
    const onValueChange = jest.fn();
    const { getByText, getByTestId, queryByText, queryByTestId } = render(
      // <== Fix here
      <CustomDropdown
        items={items}
        selectedValue={1}
        onValueChange={onValueChange}
      />
    );

    // Open the dropdown
    fireEvent.press(getByTestId("dropdown-button"));

    // Wait for the modal
    await waitFor(() => expect(getByTestId("dropdown-modal")).toBeTruthy());

    // Get the modal container
    const modal = getByTestId("dropdown-modal");

    // Check if the modal is visible
    expect(within(modal).getByText("Item 1")).toBeTruthy();
    expect(within(modal).getByText("Item 2")).toBeTruthy();

    // Press the cancel button
    fireEvent.press(within(modal).getByText("Cancel"));

    // Wait for modal to close
    await waitFor(() => expect(queryByTestId("dropdown-modal")).toBeNull());

    // Ensure the onValueChange function was not called
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
