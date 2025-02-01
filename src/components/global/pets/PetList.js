import React from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";

export default function PetList({
  pets = [],
  title,
  showAllLink = false,
  noPetsText = "No pets available",
}) {
  // If no pets, show a fallback message
  if (pets.length === 0) {
    return <ThemedText type="default">{noPetsText}</ThemedText>;
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
      <ScrollView horizontal style={styles.petList}>
        {pets.map((pet) => (
          <PrimaryPetCard key={pet.id} pet={pet} /> // Use the new component
        ))}
      </ScrollView>
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  cardContainer: {
    width: "48%",
  },
  petList: {
    marginBottom: 32,
  },
});
