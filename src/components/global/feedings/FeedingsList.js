import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import FeedingLogCard from "./FeedingLogCard";

export default function FeedingsList({
  feedings = [],
  title,
  showAllLink = false,
  noFeedingsText = "No feedings available",
}) {
  // If no feedings, show a fallback message
  if (feedings.length === 0) {
    return <ThemedText type="default">{noFeedingsText}</ThemedText>;
  }

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

      {/* Render cards */}
      <ThemedView style={styles.displayCardsContainer}>
        {feedings.map((item) => (
          <View style={styles.cardContainer}>
            <FeedingLogCard key={item.id} item={item} />
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
});
