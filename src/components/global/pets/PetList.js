// PetList.jsx
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import AddPetCard from "@/components/global/pets/AddPetCard";

export default function PetList({
  pets = [],
  title,
  showAllLink = false,
  noPetsText = "No pets available",
  onShowAllPress,
  groupId,
  loading = false,
}) {
  const navigation = useNavigation();

  const handleShowAllPress =
    onShowAllPress ||
    (groupId ? () => navigation.navigate("GroupScreen", { groupId }) : null);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <ThemedText type="default" style={styles.loadingText}>
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

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
        <AddPetCard key="add-pet-card" />
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
  },
});
