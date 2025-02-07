// PetProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import ViewByDateForPet from "./ViewByDateForPet";
import PetParallaxScrollView from "@/components/global/pets/pet_profile/PetParallaxScrollView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import { fetchPetsFromDb } from "@/database/feedings";
import { fetchFeedingsByPet } from "@/redux/actions";

export default function PetProfileScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Feedings");
  const [hasFetchedFeedings, setHasFetchedFeedings] = useState(false);

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

  useEffect(() => {
    loadPetDetails();

    if (!hasFetchedFeedings) {
      dispatch(fetchFeedingsByPet(petId));
      setHasFetchedFeedings(true);
    }
  }, []); // Empty dependency array ensures it runs only once

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
            <ThemedText>Details about {pet.name}</ThemedText>
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
