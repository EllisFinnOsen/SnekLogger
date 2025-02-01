import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchPets, fetchFeedingsByPet } from "@/redux/actions";
import { initializeDatabase, insertMockData } from "@/database";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import HomePetList from "@/components/global/pets/HomePetList";
import ViewAllFeedingsList from "@/components/global/feedings/ViewAllFeedingsList";
import ViewAllPastFeedings from "@/components/global/feedings/ViewAllPastFeedings";
import ViewPastCompleteFeedings from "@/components/global/feedings/ViewCompleteFeedings";
import { HelloWave } from "@/components/global/HelloWave";
import { SIZES } from "@/constants/Theme";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        await insertMockData();
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
      <ThemedView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.wave} type="title">
            Hello, Ellis
          </ThemedText>
          <HelloWave />
        </ThemedView>
        <HomePetList />

        <ViewAllFeedingsList />
        <ViewPastCompleteFeedings />
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.xLarge,
  },
  container: {
    paddingTop: 48,
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  wave: {
    marginRight: 16,
  },
});
