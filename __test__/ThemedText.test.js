import React from "react";
import { render } from "@testing-library/react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

// Mock the `useThemeColor` hook
jest.mock("@/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(),
}));

// Mock FONT constants
jest.mock("@/constants/Theme", () => ({
  FONT: {
    regular: "System-Regular",
    bold: "System-Bold",
    medium: "System-Medium",
  },
}));

describe("ThemedText", () => {
  beforeEach(() => {
    useThemeColor.mockImplementation(({ light, dark }, colorName) => "#000000"); // Always return black for text color
  });

  test("renders correctly with default props", () => {
    const { getByText } = render(<ThemedText>Default Text</ThemedText>);

    const textElement = getByText("Default Text");
    expect(textElement).toBeTruthy();
  });

  test("applies correct styles for type 'title'", () => {
    const { getByText } = render(
      <ThemedText type="title">Title Text</ThemedText>
    );

    const textElement = getByText("Title Text");
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: "#000000" }, // From useThemeColor mock
        expect.objectContaining({
          fontSize: 32,
          lineHeight: 32,
          fontFamily: "System-Bold",
        }), // Title style from FONT.bold
      ])
    );
  });

  test("applies correct styles for type 'subtitle'", () => {
    const { getByText } = render(
      <ThemedText type="subtitle">Subtitle Text</ThemedText>
    );

    const textElement = getByText("Subtitle Text");
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: "#000000" },
        expect.objectContaining({
          fontSize: 20,
          fontFamily: "System-Bold",
        }), // Subtitle style
      ])
    );
  });

  test("applies correct styles for type 'smDetail'", () => {
    const { getByText } = render(
      <ThemedText type="smDetail">Small Detail</ThemedText>
    );

    const textElement = getByText("Small Detail");
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: "#000000" },
        expect.objectContaining({
          fontSize: 12,
          fontFamily: "System-Medium",
        }), // smDetail style
      ])
    );
  });

  test("applies correct styles for type 'link'", () => {
    const { getByText } = render(
      <ThemedText type="link">Link Text</ThemedText>
    );

    const textElement = getByText("Link Text");
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: "#000000" },
        expect.objectContaining({
          fontSize: 16,
          lineHeight: 30,
          fontFamily: "System-Regular",
          opacity: 0.75,
        }), // Link style
      ])
    );
  });

  test("uses useThemeColor for text color", () => {
    render(<ThemedText>Test Text</ThemedText>);

    expect(useThemeColor).toHaveBeenCalledWith(
      { light: undefined, dark: undefined },
      "text"
    );
  });

  test("applies additional custom styles", () => {
    const customStyle = { fontSize: 18, fontWeight: "bold" };
    const { getByText } = render(
      <ThemedText style={customStyle}>Custom Styled Text</ThemedText>
    );

    const textElement = getByText("Custom Styled Text");
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        { color: "#000000" }, // From useThemeColor
        customStyle, // Custom styles should be applied
      ])
    );
  });
});
