// AddPetScreen.js
import React, { useState } from "react";
import { TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { addPetToDb } from "@/database";
import { addPet } from "@/redux/actions";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

// Import categories and species mapping
import {
  PET_CATEGORIES,
  SPECIES_BY_CATEGORY,
} from "@/constants/SpeciesMapping";

// Import the updated Autocomplete component
import AutocompleteInput from "@/components/global/AutocompleteInput";

export default function AddPetScreen({ navigation }) {
  const dispatch = useDispatch();

  // Pet details state
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // New category field
  const [species, setSpecies] = useState(""); // Species now depends on category
  const [morph, setMorph] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [imageURL, setImageURL] = useState("");

  // Theme colors
  const subtleColor = useThemeColor({}, "subtle");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");

  // Get species suggestions based on the selected category.
  // If no category is selected, species suggestions can be an empty array or a default list.
  const speciesSuggestions = category
    ? SPECIES_BY_CATEGORY[category] || []
    : [];

  const handleSave = async () => {
    try {
      const newPet = {
        name,
        category, // save the category too
        species,
        morph,
        birthDate,
        weight,
        imageURL,
      };
      const petId = await addPetToDb(newPet);
      dispatch(addPet({ ...newPet, id: petId }));
      navigation.goBack();
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  return (
    <ThemedView style={[styles.container, { overflow: "visible" }]}>
      <ThemedText type="title">Add New Pet</ThemedText>

      {/* Name field */}
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
          },
        ]}
        placeholder="Name"
        placeholderTextColor={iconColor}
        value={name}
        onChangeText={setName}
      />

      {/* Category selection */}
      <AutocompleteInput
        suggestions={PET_CATEGORIES}
        value={category}
        onChangeText={(value) => {
          setCategory(value);
          // Clear species when category changes
          setSpecies("");
        }}
        placeholder="Category"
        textColor={textColor}
        iconColor={iconColor}
        bgColor={bgColor}
      />

      {/* Species selection - suggestions change based on selected category */}
      <AutocompleteInput
        suggestions={speciesSuggestions}
        value={species}
        onChangeText={setSpecies}
        placeholder="Species"
        textColor={textColor}
        iconColor={iconColor}
        bgColor={bgColor}
      />

      {/* Morph field */}
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
          },
        ]}
        placeholder="Morph"
        placeholderTextColor={iconColor}
        value={morph}
        onChangeText={setMorph}
      />

      {/* Birth Date field */}
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
          },
        ]}
        placeholder="Birth Date"
        placeholderTextColor={iconColor}
        value={birthDate}
        onChangeText={setBirthDate}
      />

      {/* Weight field */}
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
          },
        ]}
        placeholder="Weight"
        placeholderTextColor={iconColor}
        value={weight}
        onChangeText={setWeight}
      />

      {/* Image URL field */}
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
          },
        ]}
        placeholder="Image URL"
        placeholderTextColor={iconColor}
        value={imageURL}
        onChangeText={setImageURL}
      />

      <Button title="Save" onPress={handleSave} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
});
