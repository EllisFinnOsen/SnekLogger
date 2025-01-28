import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchPets, fetchFeedingsByPet } from "../../redux/actions";
import { initializeDatabase } from "../../database";
import { ThemedView } from "../../components/global/ThemedView";
import { ThemedText } from "../../components/global/ThemedText";
import ThemedScrollView from "../../components/global/ThemedScrollView";
import HorizontalPetsList from "../../components/global/pets/HorizontalPetsList";
import ViewAllFeedingsList from "../../components/global/feedings/ViewAllFeedingsList";
import { HelloWave } from "../../components/global/HelloWave";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        dispatch(fetchPets());
      } catch (error) {
        console.error("Error setting up database:", error);
      }
    };

    setupDatabase();
  }, [dispatch]);

  useEffect(() => {
    if (pets.length > 0) {
      pets.forEach((pet) => dispatch(fetchFeedingsByPet(pet.id)));
    }
  }, [dispatch, pets]);

  return (
    <ThemedScrollView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Hello, Ellis</ThemedText>
          <HelloWave />
        </ThemedView>
        <HorizontalPetsList />
        <ThemedText type="title">Upcoming Feedings</ThemedText>
        <ViewAllFeedingsList />
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  container: {
    paddingTop: 48,
    flex: 1,
    padding: 16,
    gap: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
