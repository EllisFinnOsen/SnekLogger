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
            if (itemValue !== category) {
              setCategory(itemValue);
              // Only reset if the category is actually changed
              setSpecies("");
              setMorph("");
            }
          }}
          items={PET_CATEGORIES}
        />
      </View>
      {category ? (
        <View style={styles.fieldContainer}>
          <CategoryPicker
            label="Species"
            key={`species-picker-${category}-${species}`}
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
            key={`species-picker-${species}-${morph}`}
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
