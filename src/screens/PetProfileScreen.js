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
    }, [petId])
  );

  const handleEditPress = () => {
    navigation.navigate("EditPetScreen", { petId: petId });
  };

  return (
    <PetParallaxScrollView
      headerImageSrc={pet?.imageURL}
      headerBackgroundColor={{ light: "#ccc", dark: "#333" }}
      petName={pet?.name}
      petBirthdate={pet?.birthDate}
      petMorph={pet?.morph}
      onEditPress={handleEditPress} // Pass handleEditPress to PetParallaxScrollView
    >
      <ViewPetProfileFeedings feedings={feedings} />
    </PetParallaxScrollView>
  );
}
