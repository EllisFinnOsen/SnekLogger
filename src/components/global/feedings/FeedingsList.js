import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import FeedingLogCard from "@/components/global/feedings/FeedingLogCard";

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
          <View key={item.id} style={styles.cardContainer}>
            <FeedingLogCard item={item} />
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
    marginBottom: 32,
  },
});
