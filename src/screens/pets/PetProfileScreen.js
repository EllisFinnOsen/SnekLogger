// PetProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { fetchFeedingsByPet } from "@/redux/actions";
import { fetchPetsFromDb } from "@/database";
// Import your new feeding component
import ViewByDateForPet from "./ViewByDateForPet";
import PetParallaxScrollView from "@/components/global/pets/pet_profile/PetParallaxScrollView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";

export default function PetProfileScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Feedings");

  // (Optional) Use feedings state if needed for something else
  const feedings = useSelector((state) => state.feedings);

  const handleEditPress = () => {
    navigation.navigate("EditPetScreen", { petId });
  };

  // Fetch pet details
  const loadPetDetails = async () => {
    try {
      const pets = await fetchPetsFromDb();
      const foundPet = pets.find((p) => p.id === petId);
      setPet(foundPet);
    } catch (error) {
      //console.error("Error loading pet details:", error);
    }
  };

  // Refresh pet details and feedings when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPetDetails();
      // If your new component handles its own fetching of feedings, you may not need this dispatch
      dispatch(fetchFeedingsByPet(petId));
    }, [dispatch, petId])
  );

  if (!pet) return <Text>Loading pet details...</Text>;

  return (
    <PetParallaxScrollView
      headerImageSrc={pet?.imageURL}
      headerBackgroundColor={{ light: "#fff", dark: "#000" }}
      petName={pet?.name}
      petBirthdate={pet?.birthDate}
      petMorph={pet?.morph}
      onEditPress={handleEditPress} // Pass the prop here
    >
      <View style={styles.container}>
        {/* Tabs Header */}
        <View style={styles.tabContainer}>
          <TabButton
            title="Feedings"
            isSelected={selectedTab === "Feedings"}
            onPress={() => setSelectedTab("Feedings")}
          />
          <TabButton
            title="Details"
            isSelected={selectedTab === "Details"}
            onPress={() => setSelectedTab("Details")}
          />
        </View>

        {/* Tab Content */}
        {selectedTab === "Feedings" ? (
          // Pass petId AND pet if needed. Remove pet if only petId is required.
          <ViewByDateForPet petId={petId} pet={pet} />
        ) : (
          <ScrollView>
            <Text>Details about {pet.name}</Text>
            {/* Add additional pet details as needed */}
          </ScrollView>
        )}
      </View>
    </PetParallaxScrollView>
  );
}

// Reusable TabButton component
const TabButton = ({ title, isSelected, onPress }) => {
  const activeColor = useThemeColor({}, "active"); // Move inside component
  const fieldColor = useThemeColor({}, "field"); // Move inside component
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: isSelected ? activeColor : fieldColor }, // Apply active color dynamically
      ]}
      onPress={onPress}
    >
      <ThemedText type="default" style={styles.tabButtonText}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flext-start",
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginRight: 16,
  },
});
