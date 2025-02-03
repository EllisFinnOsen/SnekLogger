// PrimaryPetCard.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard"; // Adjust the import path as needed
import { checkImageURL } from "@/utils/checkImage";

// Create a mock function for navigation
const mockNavigate = jest.fn();

// Mock the useNavigation hook from react-navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the checkImageURL utility function
jest.mock("@/utils/checkImage", () => ({
  checkImageURL: jest.fn(),
}));

describe("PrimaryPetCard", () => {
  // Sample pet data for testing
  const pet = {
    id: "123",
    name: "Fluffy",
    morph: "Golden Retriever",
    imageURL: "https://example.com/pet.jpg",
  };

  // Clear mocks before each test to avoid test interference
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders pet name and morph", () => {
    // Simulate that the pet.imageURL is valid
    checkImageURL.mockReturnValue(true);

    const { getByText } = render(<PrimaryPetCard pet={pet} />);

    expect(getByText("Fluffy")).toBeTruthy();
    expect(getByText("Golden Retriever")).toBeTruthy();
  });

  test("renders image with pet.imageURL when checkImageURL returns true", () => {
    checkImageURL.mockReturnValue(true);

    const { getByTestId } = render(<PrimaryPetCard pet={pet} />);
    const image = getByTestId("primary-pet-image");
    expect(image.props.source.uri).toBe(pet.imageURL);
  });

  test("renders image with default url when checkImageURL returns false", () => {
    checkImageURL.mockReturnValue(false);

    const { getByTestId } = render(<PrimaryPetCard pet={pet} />);
    const image = getByTestId("primary-pet-image");
    const defaultUrl =
      "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D";
    expect(image.props.source.uri).toBe(defaultUrl);
  });

  test("navigates to PetProfile with petId when pressed", () => {
    checkImageURL.mockReturnValue(true);

    const { getByTestId } = render(<PrimaryPetCard pet={pet} />);
    // Find the TouchableOpacity by its testID.
    const touchable = getByTestId("primary-pet-card");

    fireEvent.press(touchable);

    expect(mockNavigate).toHaveBeenCalledWith("PetProfileScreen", {
      petId: pet.id,
    });
  });
});
