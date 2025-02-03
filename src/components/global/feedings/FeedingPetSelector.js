import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import ExistingPetPicker from "@/components/global/pets/add_pet/ExistingPetPicker";

export default function FeedingPetSelector({
  pets,
  selectedPetId,
  setSelectedPetId,
  isEditing,
}) {
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: selectedPet?.imageURL || "https://via.placeholder.com/50",
        }}
        style={styles.petImage}
      />
      {isEditing ? (
        <ExistingPetPicker
          items={pets.map((pet) => ({
            label: pet.name,
            value: pet.id,
            imageURL: pet.imageURL,
          }))}
          selectedValue={selectedPetId}
          onValueChange={setSelectedPetId}
        />
      ) : (
        <ThemedText type="subtitle">
          {selectedPet?.name || "Select a pet"}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 16,
  },
});
