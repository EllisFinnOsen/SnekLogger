import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { initializeDatabase } from "@/database";
import { insertMockData } from "@/database/mockData";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import HomePetList from "@/components/global/pets/HomePetList";
import FeedingsByDaySections from "@/components/global/feedings/FeedingsByDaySections.js";
import { HelloWave } from "@/components/global/HelloWave";
import { SIZES } from "@/constants/Theme";
import { fetchPets } from "@/redux/actions";
import { fetchFeedingsByPet } from "@/redux/actions";
import { fetchUserProfile } from "@/redux/actions";
import { resetDatabase } from "@/database/reset";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);
  const userProfileFromRedux = useSelector((state) => state.user.profile);

  // Local state to update when Redux state is fetched
  const [userProfile, setUserProfile] = useState(userProfileFromRedux);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await resetDatabase();
        await initializeDatabase();
        await insertMockData();
        dispatch(fetchPets());
        dispatch(fetchUserProfile()); // Fetch user profile on load
      } catch (error) {
        //console.error("Error setting up database:", error);
      }
    };

    setupDatabase();
  }, [dispatch]);

  useEffect(() => {
    if (pets.length > 0) {
      pets.forEach((pet) => dispatch(fetchFeedingsByPet(pet.id)));
    }
  }, [dispatch, pets]);

  // Update local state when Redux state updates
  useEffect(() => {
    if (userProfileFromRedux) {
      setUserProfile(userProfileFromRedux);
    }
  }, [userProfileFromRedux]);

  return (
    <ThemedScrollView>
      <ThemedView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.wave} type="title">
            Hello, {userProfile?.name || "User"}
          </ThemedText>
          <HelloWave />
        </ThemedView>
        <HomePetList />
        <FeedingsByDaySections />
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
  wave: {
    marginRight: 16,
  },
});
