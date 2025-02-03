import React from "react";
import { View, StyleSheet } from "react-native";
import CategoryPicker from "@/components/global/CategoryPicker";
import SearchablePicker from "@/components/global/SearchablePicker";
import { ThemedText } from "@/components/global/ThemedText";
import {
  PET_CATEGORIES,
  SPECIES_BY_CATEGORY,
} from "@/constants/SpeciesMapping";
import { MORPH_TYPES } from "@/constants/MorphTypes";

export default function CategorySection({
  category,
  setCategory,
  species,
  setSpecies,
  morph,
  setMorph,
}) {
  const speciesSuggestions = category
    ? SPECIES_BY_CATEGORY[category] || []
    : [];

  return (
    <>
      <View style={styles.fieldContainer}>
        <CategoryPicker
          label="Category"
          selectedValue={category}
          onValueChange={(itemValue) => {
            setCategory(itemValue);
            // Reset species and morph if category changes.
            setSpecies("");
            setMorph("");
          }}
          items={PET_CATEGORIES}
        />
      </View>
      {category ? (
        <View style={styles.fieldContainer}>
          <CategoryPicker
            label="Species"
            selectedValue={species}
            onValueChange={(itemValue) => {
              setSpecies(itemValue);
              setMorph("");
            }}
            items={speciesSuggestions}
          />
        </View>
      ) : null}
      {species ? (
        <View style={styles.fieldContainer}>
          <ThemedText type="default" style={styles.label}>
            Morph
          </ThemedText>
          <SearchablePicker
            options={MORPH_TYPES[species] || []}
            selectedValue={morph}
            onValueChange={setMorph}
            placeholder="Select a morph..."
            otherLabel="Other (Enter custom morph)"
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
});
