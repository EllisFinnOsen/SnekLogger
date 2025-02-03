import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import FeedingLogCard from "@/components/global/feedings/FeedingLogCard";
import LoadingCard from "./LoadingCard";
import AddLogCard from "./AddLogCard"; // Import AddLogCard

export default function FeedingsList({
  feedings = [],
  title,
  showAllLink = false,
  noFeedingsText = "No feedings available",
  includeAddLogCard = false, // New prop: determines if we should insert AddLogCard at the start
}) {
  const [loading, setLoading] = useState(true);

  // Introduce an artificial delay before showing the real feedings
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 100); // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(timeout);
  }, []);

  // Show the loader while loading
  if (loading) {
    return (
      <ThemedView>
        <ThemedText type="default">Loading feedings...</ThemedText>
        <LoadingCard />
      </ThemedView>
    );
  }

  // If no feedings exist, show a fallback message
  if (feedings.length === 0) {
    return (
      <ThemedView>
        <ThemedText type="default">{noFeedingsText}</ThemedText>
      </ThemedView>
    );
  }

  // If includeAddLogCard is true, insert AddLogCard as the first list item
  const modifiedFeedings = includeAddLogCard
    ? [{ id: "add-log-card" }, ...feedings] // Unique ID for AddLogCard
    : feedings;

  return (
    <ThemedView>
      {/* Optional header area */}
      {title || showAllLink ? (
        <ThemedView style={styles.header}>
          {title && <ThemedText type="subtitle">{title}</ThemedText>}
          {showAllLink && (
            <TouchableOpacity>
              <ThemedText type="link">Show all</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      ) : null}

      {/* Render feeding logs */}
      <ThemedView style={styles.displayCardsContainer}>
        {modifiedFeedings.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
            {item.id === "add-log-card" ? (
              <AddLogCard />
            ) : (
              <FeedingLogCard item={item} />
            )}
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  displayCardsContainer: {
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 8,
  },
});
