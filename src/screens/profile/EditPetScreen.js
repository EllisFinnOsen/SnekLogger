// EditPetScreen.js
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { fetchPetById, updatePetToDb } from "@/database"; // Create/update these functions as needed
import { updatePet } from "@/redux/actions"; // Create an update action if you don't have one already
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";

// Import subcomponents (same as AddPetScreen)
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import PetNameField from "@/components/global/pets/add_pet/PetNameField";
import CategorySection from "@/components/global/pets/add_pet/CategorySection";
import BirthDateField from "@/components/global/pets/add_pet/BirthdayField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import PetImageField from "@/components/global/pets/add_pet/PetImageField";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";

export default function EditPetScreen({ route, navigation }) {
  const { petId } = route.params;

  const dispatch = useDispatch();

  // Theme colors
  const activeColor = useThemeColor({}, "active");

  // State for pet details (initially empty)
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [category, setCategory] = useState("");
  const [species, setSpecies] = useState("");
  const [morph, setMorph] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState(0);
  const [weightType, setWeightType] = useState("g");
  const [imageURL, setImageURL] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load pet data when the screen mounts (or petId changes)
  useEffect(() => {
    async function loadPetData() {
      try {
        console.log(
          "Fetching pet with petId:",
          petId,
          " (type:",
          typeof petId,
          ")"
        );
        const pet = await fetchPetById(petId);
        console.log("Fetched pet:", pet);
        if (pet) {
          setName(pet.name || "");
          setCategory(pet.category || "");
          setSpecies(pet.species || "");
          setMorph(pet.morph || "");
          setBirthDate(pet.birthDate || "");
          setWeight(pet.weight || 0);
          setWeightType(pet.weightType || "g");
          setImageURL(pet.imageURL || "");
        } else {
          console.warn("No pet returned for id:", petId);
        }
      } catch (error) {
        console.error("Error loading pet details:", error);
      }
    }
    if (petId) {
      loadPetData();
    }
  }, [petId]);

  const handleSave = async () => {
    // Validate pet name
    if (!name.trim()) {
      setNameError("Pet name is required.");
      return;
    } else {
      setNameError("");
    }

    try {
      const updatedPet = {
        id: petId, // include the pet's id here
        name,
        category,
        species,
        morph,
        birthDate,
        weight,
        weightType,
        imageURL,
      };

      // Update the pet in your database
      await updatePetToDb(updatedPet);

      // Optionally dispatch an action to update your Redux store
      dispatch(updatePet(updatedPet));

      navigation.goBack();
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  const confirmUpdate = async () => {
    const petAfterUpdate = await fetchPetById(petId);
    console.log("Pet after update:", petAfterUpdate);
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection onCancel={() => navigation.goBack()} />
      <EditHeader
        label="Edit Pet"
        description="Update the pet details below and press save."
      />
      <PetImageField imageURL={imageURL} setImageURL={setImageURL} />

      <PetNameField
        name={name}
        setName={(text) => {
          setName(text);
          if (text.trim()) {
            setNameError("");
          }
        }}
        required={true}
        errorMessage={nameError}
      />
      <BirthDateField
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />
      <WeightField
        weight={weight}
        setWeight={setWeight}
        weightType={weightType}
        setWeightType={setWeightType}
      />
      <CategorySection
        category={category}
        setCategory={setCategory}
        species={species}
        setSpecies={setSpecies}
        morph={morph}
        setMorph={setMorph}
      />

      <CustomButton
        title="Save"
        textType="title"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: activeColor }]}
      />
      <View style={styles.spacer} />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  spacer: {
    height: 36,
  },
});
