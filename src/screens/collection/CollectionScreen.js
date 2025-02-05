// CollectionScreen.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import CollectionPetList from "@/components/global/pets/CollectionPetList";
import AddGroupButton from "@/components/global/groups/AddGroupButton"; // import our new AddGroupButton
import { SIZES } from "@/constants/Theme";
import { fetchGroups } from "@/redux/actions";

export default function CollectionScreen() {
  const dispatch = useDispatch();
  // Extract the groups array from the groups reducer
  const groups = useSelector((state) => state.groups.groups || []);
  //console.log("Groups from Redux:", groups);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupData = async () => {
      try {
        await dispatch(fetchGroups());
      } catch (error) {
        //console.error("Error fetching groups:", error);
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
        {/* Always show the AddGroupButton at the top */}
        <AddGroupButton />
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
