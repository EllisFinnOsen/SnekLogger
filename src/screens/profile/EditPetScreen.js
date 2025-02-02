import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPetById,
  updatePetToDb,
  fetchGroupsForPetFromDb,
} from "@/database"; // Make sure fetchGroupsForPetFromDb exists
import {
  updatePet,
  addPetToGroupAction,
  removePetFromGroupAction,
} from "@/redux/actions";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";

// Import subcomponents (reuse from AddPetScreen)
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import PetNameField from "@/components/global/pets/add_pet/PetNameField";
import CategorySection from "@/components/global/pets/add_pet/CategorySection";
import BirthDateField from "@/components/global/pets/add_pet/BirthdayField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import PetImageField from "@/components/global/pets/add_pet/PetImageField";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";
import MultipleGroupPicker from "@/components/global/pets/add_pet/MultipleGroupPicker";

export default function EditPetScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();

  // Theme colors
  const activeColor = useThemeColor({}, "active");

  // State for pet details
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

  // State for the pet's group memberships.
  // selectedGroups: the current selection in the picker.
  // initialGroups: the groups that the pet was originally linked to.
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [initialGroups, setInitialGroups] = useState([]);

  // Get available groups from Redux.
  const availableGroups = useSelector((state) => state.groups.groups || []);
  console.log("Available Groups:", availableGroups);

  // Load pet data (including current group memberships) when the screen mounts.
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

          // Fetch the groups this pet is currently in.
          const petGroups = await fetchGroupsForPetFromDb(petId);
          console.log("Fetched groups for pet:", petGroups);
          setSelectedGroups(petGroups || []);
          setInitialGroups(petGroups || []);
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

      // Update the pet in your database.
      await updatePetToDb(updatedPet);

      // Optionally dispatch an action to update your Redux store.
      dispatch(updatePet(updatedPet));

      // Update group links:
      // Remove any group links that were in the initialGroups but are no longer selected.
      const groupsToRemove = initialGroups.filter(
        (grp) => !selectedGroups.some((sGrp) => sGrp && sGrp.id === grp.id)
      );
      for (const grp of groupsToRemove) {
        await dispatch(removePetFromGroupAction(grp.id, petId));
      }

      // Add any new group links: (if a group is selected that wasn't originally linked)
      const groupsToAdd = selectedGroups.filter(
        (grp) => !initialGroups.some((iGrp) => iGrp && iGrp.id === grp.id)
      );
      for (const grp of groupsToAdd) {
        await dispatch(addPetToGroupAction(grp.id, petId));
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error updating pet:", error);
    }
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

      {/* Render the multiple group picker */}
      <MultipleGroupPicker
        selectedGroups={selectedGroups}
        setSelectedGroups={setSelectedGroups}
        availableGroups={availableGroups}
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
