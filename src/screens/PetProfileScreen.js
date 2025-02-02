// PetProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { fetchPetsFromDb } from "@/database";
import PetParallaxScrollView from "@/components/global/pets/pet_profile/PetParallaxScrollView";
import ViewByDateForPet from "./profile/ViewByDateForPet";
import ViewPastCompletePet from "./profile/ViewPastCompletePet";

export default function PetProfileScreen({ route, navigation }) {
  console.log("Route params:", route.params);
  // Make sure your route params include petId (or a pet object)
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);

  // Fetch pet details from the database
  const loadPetDetails = async () => {
    try {
      const pets = await fetchPetsFromDb();
      const foundPet = pets.find((p) => p.id === petId);
      setPet(foundPet);
    } catch (error) {
      console.error("Error loading pet details:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPetDetails();
    }, [petId])
  );

  const handleEditPress = () => {
    navigation.navigate("EditPetScreen", { petId });
  };

  return (
    <PetParallaxScrollView
      headerImageSrc={pet?.imageURL}
      headerBackgroundColor={{ light: "#ccc", dark: "#333" }}
      petName={pet?.name}
      petBirthdate={pet?.birthDate}
      petMorph={pet?.morph}
      onEditPress={handleEditPress}
    >
      <View style={styles.container}>
        <ViewByDateForPet petId={petId} />
      </View>
    </PetParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    flex: 1,
    padding: 16,
  },
});
