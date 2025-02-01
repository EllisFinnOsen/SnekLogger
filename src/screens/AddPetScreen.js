import React, { useState } from "react";
import {
  TextInput,
  Button,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { addPetToDb } from "@/database";
import { addPet } from "@/redux/actions";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import EditHeader from "@/components/global/EditHeader";

// Import categories and species mapping
import {
  PET_CATEGORIES,
  SPECIES_BY_CATEGORY,
} from "@/constants/SpeciesMapping";

// Import the picker component (for Category & Species)
import CategoryPicker from "@/components/global/CategoryPicker";

// Import morph types
import { MORPH_TYPES } from "@/constants/MorphTypes";

// Import our AutocompleteInput for the morph field
import SearchablePicker from "@/components/global/SearchablePicker";

// If you are using Expo, you can use Ionicons (or replace with your icon library)
import { Ionicons } from "@expo/vector-icons";
import { SIZES } from "@/constants/Theme";

export default function AddPetScreen({ navigation }) {
  const dispatch = useDispatch();

  // Theme colors (retrieved once for reuse)
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  // State for pet details
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [species, setSpecies] = useState("");
  const [morph, setMorph] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [imageURL, setImageURL] = useState("");

  // Get species suggestions based on the selected category.
  const speciesSuggestions = category
    ? SPECIES_BY_CATEGORY[category] || []
    : [];

  const handleSave = async () => {
    try {
      const newPet = {
        name,
        category,
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
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* Custom header with Back arrow and Cancel link */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelText, { color: textColor }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <EditHeader
        label={"Add New Pet"}
        description={
          "Enter the listed details and press save to add a new pet."
        }
      />

      {/* Field Container for consistent spacing */}
      <View style={styles.fieldContainer}>
        <ThemedText type="default" style={styles.label}>
          Name
        </ThemedText>
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
      </View>

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
              // Reset morph when species changes.
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
          />
        </View>
      ) : null}

      <View style={styles.fieldContainer}>
        <ThemedText type="default" style={styles.label}>
          Birth Date
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              borderColor: iconColor,
              backgroundColor: bgColor,
            },
          ]}
          placeholder="eg. 06/16/2024"
          placeholderTextColor={iconColor}
          value={birthDate}
          onChangeText={setBirthDate}
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="default" style={styles.label}>
          Weight
        </ThemedText>
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
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="subtitle" style={styles.label}>
          Image URL
        </ThemedText>
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
      </View>

      <Button title="Save" onPress={handleSave} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8, // Ensure no extra padding is added by the scroll view
  },
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16, // Added horizontal padding if needed
  },
  cancelText: {
    fontSize: 16,
  },
  fieldContainer: {
    marginVertical: 0, // Matches the marginVertical used in CategoryPicker's container
  },
  label: {
    marginBottom: 4, // Matches CategoryPicker's label marginBottom
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: SIZES.small,
    borderRadius: 5,
    paddingVertical: SIZES.medium,
  },
});
