import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TabButton from "@/components/global/TabButton"; // Adjust the import path as needed

describe("TabButton", () => {
  const defaultProps = {
    name: "Home",
    activeTab: "Home",
    onHandleSearchType: jest.fn(),
    activeColor: "blue",
    subtleTextColor: "gray",
    iconColor: "red",
    textColor: "white",
    bgColor: "black",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the button with the correct text", () => {
    const { getByText } = render(<TabButton {...defaultProps} />);
    expect(getByText("Home")).toBeTruthy();
  });

  it("calls onHandleSearchType when pressed", () => {
    const onPressMock = jest.fn();
    const props = { ...defaultProps, onHandleSearchType: onPressMock };
    const { getByText } = render(<TabButton {...props} />);
    // Since the Text is inside the TouchableOpacity, firing an event on the Text will bubble up.
    const buttonText = getByText("Home");
    fireEvent.press(buttonText);
    expect(onPressMock).toHaveBeenCalled();
  });

  it("applies active styles when name equals activeTab", () => {
    // In active state, the button background should be activeColor and the text color should be textColor.
    const props = { ...defaultProps, name: "Home", activeTab: "Home" };
    const { toJSON } = render(<TabButton {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("applies inactive styles when name does not equal activeTab", () => {
    // In inactive state, the button background should be subtleTextColor and the text color should be bgColor.
    const props = { ...defaultProps, name: "Home", activeTab: "Profile" };
    const { toJSON } = render(<TabButton {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
