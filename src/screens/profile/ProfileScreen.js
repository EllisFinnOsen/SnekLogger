import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { fetchFeedingsByPet } from "@/redux/actions";
import { fetchPetsFromDb } from "@/database";
import ViewPetProfileFeedings from "@/components/global/feedings/ViewPetProfileFeedings";

export default function PetProfileScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);
  const feedings = useSelector((state) => state.feedings);

  // Fetch pet details
  const loadPetDetails = async () => {
    try {
      const pets = await fetchPetsFromDb();
      const foundPet = pets.find((p) => p.id === petId);
      setPet(foundPet);
    } catch (error) {
      //feeding//console.error("Error loading pet details:", error);
    }
  };

  // Use useFocusEffect to refresh data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPetDetails();
      dispatch(fetchFeedingsByPet(petId));
    }, [dispatch, petId])
  );

  return (
    <View style={styles.container}>
      {pet ? (
        <>
          <Text style={styles.title}>{pet.name}’s Profile</Text>
          <Text style={styles.detail}>ID: {pet.id}</Text>
          <ViewPetProfileFeedings petId={petId} />
        </>
      ) : (
        <Text>Loading pet details...</Text>
      )}

      <Text style={styles.title}>Feedings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 16,
  },
  feedingCard: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  feedingText: {
    fontSize: 16,
  },
});
