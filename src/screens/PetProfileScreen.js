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
import { fetchFeedingsByPet } from "@/redux/actions";
import { fetchPetsFromDb } from "@/database";
import ViewPetProfileFeedings from "@/components/global/feedings/ViewPetProfileFeedings";
import PetParallaxScrollView from "@/components/global/pets/pet_profile/PetParallaxScrollView";

export default function PetProfileScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Feedings"); // State to manage selected tab
  const feedings = useSelector((state) => state.feedings);

  // Fetch pet details
  const loadPetDetails = async () => {
    try {
      const pets = await fetchPetsFromDb();
      const foundPet = pets.find((p) => p.id === petId);
      setPet(foundPet);
    } catch (error) {
      console.error("Error loading pet details:", error);
    }
  };

  // Use useFocusEffect to refresh data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPetDetails();
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
    >
      <View style={styles.container}>
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

        {selectedTab === "Feedings" ? (
          <ViewPetProfileFeedings petId={petId} />
        ) : (
          <ScrollView>
            <Text>Details about {pet.name}</Text>
            {/* Add more details about the pet here */}
          </ScrollView>
        )}
      </View>
    </PetParallaxScrollView>
  );
}

const TabButton = ({ title, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, isSelected && styles.selectedTabButton]}
    onPress={onPress}
  >
    <Text style={styles.tabButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  selectedTabButton: {
    backgroundColor: "#0a7ea4",
  },
  tabButtonText: {
    color: "#fff",
  },
});
