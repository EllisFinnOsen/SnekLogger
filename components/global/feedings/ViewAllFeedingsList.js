import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { ThemedView } from "../ThemedView";
import { getUpcomingFeedings } from "../../../utils/dateUtils";
import FeedingLogCard from "./FeedingLogCard";
import { ThemedText } from "../ThemedText";
import { selectUpcomingFeedings } from "../../../redux/selectors"; // Import the memoized selector

export default function ViewAllFeedingsList() {
  const upcomingFeedings = useSelector(selectUpcomingFeedings);

  if (upcomingFeedings.length === 0) {
    return (
      <ThemedText type="default">No upcoming feedings available</ThemedText>
    );
  }

  return (
    <ThemedView>
      {upcomingFeedings.map((item) => (
        <FeedingLogCard key={item.id} item={item} /> // Use the new component
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  feedingCard: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
});
