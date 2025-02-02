import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import CollectionPetList from "@/components/global/pets/CollectionPetList";
import { SIZES } from "@/constants/Theme";
import { fetchGroups } from "@/redux/actions"; // Import your fetchGroups action

export default function CollectionScreen() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups || []); // assuming your groups reducer is set up
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupData = async () => {
      try {
        // Dispatch the action to fetch groups from your database
        await dispatch(fetchGroups());
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setupData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <ThemedScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Collection
        </ThemedText>
        {/* Pass the groups from Redux into CollectionPetList */}
        <CollectionPetList groups={groups} />
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: SIZES.xLarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
