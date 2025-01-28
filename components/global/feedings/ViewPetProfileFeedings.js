import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";
import FeedingLogCard from "./FeedingLogCard"; // Import the FeedingLogCard component
import { selectFeedingsByPet } from "../../../redux/selectors"; // Import the memoized selector

export default function ViewPetProfileFeedings({ petId }) {
  const feedings = useSelector((state) => selectFeedingsByPet(state, petId));

  if (feedings.length === 0) {
    return (
      <ThemedText type="default">
        No feedings available for this pet.
      </ThemedText>
    );
  }

  return (
    <View style={styles.container}>
      {feedings.map((feeding) => (
        <FeedingLogCard key={feeding.id} item={feeding} /> // Use the FeedingLogCard component
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
