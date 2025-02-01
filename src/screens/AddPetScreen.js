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

import { WEIGHT_TYPES } from "@/constants/WeightTypes";

// Import the picker component (for Category & Species)
import CategoryPicker from "@/components/global/CategoryPicker";

// Import morph types
import { MORPH_TYPES } from "@/constants/MorphTypes";

// Import our AutocompleteInput for the morph field
import SearchablePicker from "@/components/global/SearchablePicker";

// If you are using Expo, you can use Ionicons (or replace with your icon library)
import { Ionicons } from "@expo/vector-icons";
import { SIZES } from "@/constants/Theme";
import DateTimePicker from "@react-native-community/datetimepicker";
// Import the custom WeightSelector
import WeightSelector from "@/components/global/WeightSelector";

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
  // For weight, we'll use a numeric value starting at 0.00
  const [weight, setWeight] = useState(0);
  const [weightType, setWeightType] = useState("g"); // default to grams

  const [imageURL, setImageURL] = useState("");

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const WeightTypes = WEIGHT_TYPES;

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
        weightType,
        imageURL,
      };
      const petId = await addPetToDb(newPet);
      dispatch(addPet({ ...newPet, id: petId }));
      navigation.goBack();
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  // Format the date for display (you can adjust locale or format as needed)
  const formattedBirthDate = birthDate
    ? new Date(birthDate).toLocaleDateString()
    : "Select approximate date";

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
              fontSize: SIZES.medium,
            },
          ]}
          placeholder="Enter pet's name"
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
      {/* Birth Date Field */}
      <View style={styles.fieldContainer}>
        <ThemedText type="default" style={styles.label}>
          Birth Date
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.input,
            styles.dateInput,
            { backgroundColor: bgColor, borderColor: iconColor },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText type="default" style={{ color: textColor }}>
            {formattedBirthDate}
          </ThemedText>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate ? new Date(birthDate) : new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthDate(selectedDate.toISOString());
              }
            }}
          />
        )}
      </View>
      <View style={styles.fieldContainer}>
        <ThemedText type="default" style={styles.label}>
          Weight
        </ThemedText>
        <View style={styles.weightRow}>
          {/* Weight number selector */}
          <WeightSelector
            value={weight}
            onChange={setWeight}
            min={0}
            max={100000}
            step={1}
          />
          {/* Weight type picker in a container with fixed, smaller width */}
          <View style={styles.weightTypeContainer}>
            <CategoryPicker
              compact={true}
              selectedValue={weightType}
              onValueChange={(itemValue) => setWeightType(itemValue)}
              items={WEIGHT_TYPES}
              // Pass a custom style prop if your CategoryPicker supports it
              // Otherwise, wrap it as shown here.
            />
          </View>
        </View>
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
              fontSize: SIZES.medium,
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
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flext-start",
  },
  weightTypeContainer: {
    marginLeft: 32,
    width: 50, // Try 50 pixels first; adjust if needed.
    // Optionally, you can add styles to center the content:
    justifyContent: "center",
    alignItems: "center",
  },
});
