import { renderHook } from "@testing-library/react-hooks";
import { useColorScheme as _useColorScheme } from "react-native";
import useColorScheme from "@/hooks/useColorScheme";

// Mock the useColorScheme function from react-native
jest.mock("react-native", () => ({
  useColorScheme: jest.fn(),
}));

describe("useColorScheme", () => {
  it("should return the color scheme from react-native", () => {
    // Mock the return value of useColorScheme
    _useColorScheme.mockReturnValue("dark");

    // Render the hook
    const { result } = renderHook(() => useColorScheme());

    // Assert that the hook returns the correct value
    expect(result.current).toBe("dark");
  });

  it("should return the default color scheme if none is set", () => {
    // Mock the return value of useColorScheme
    _useColorScheme.mockReturnValue(null);

    // Render the hook
    const { result } = renderHook(() => useColorScheme());

    // Assert that the hook returns the correct value
    expect(result.current).toBe(null);
  });
});
