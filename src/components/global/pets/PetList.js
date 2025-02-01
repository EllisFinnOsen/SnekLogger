import React from "react";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import AddPetCard from "@/components/global/pets/AddPetCard"; // Import AddPetCard

export default function PetList({
  pets = [],
  title,
  showAllLink = false,
  noPetsText = "No pets available",
  onShowAllPress, // optional custom press handler
  groupId, // if provided and no custom onShowAllPress, navigate to GroupScreen
}) {
  const navigation = useNavigation();

  // Determine what happens when the "Show all" link is pressed.
  // If a custom onShowAllPress is provided, use that.
  // Otherwise, if a groupId is provided, navigate to "GroupScreen" with that groupId.
  const handleShowAllPress =
    onShowAllPress ||
    (groupId ? () => navigation.navigate("GroupScreen", { groupId }) : null);

  // If there are no pets, display the fallback text.
  if (pets.length === 0) {
    return <ThemedText type="default">{noPetsText}</ThemedText>;
  }

  return (
    <ThemedView>
      {(title || showAllLink) && (
        <ThemedView style={styles.header}>
          {title && <ThemedText type="subtitle">{title}</ThemedText>}
          {showAllLink && handleShowAllPress && (
            <TouchableOpacity onPress={handleShowAllPress}>
              <ThemedText type="link">Show all</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}

      <ScrollView horizontal style={styles.petList}>
        {pets.map((pet) => (
          <PrimaryPetCard key={pet.id} pet={pet} />
        ))}
        <AddPetCard />
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
  petList: {
    flexDirection: "row",
  },
});
