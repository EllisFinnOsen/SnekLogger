import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator, View, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import PetNameField from "@/components/global/pets/add_pet/PetNameField";
import DatePickerField from "@/components/global/DatePickerField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import PetImageField from "@/components/global/pets/add_pet/PetImageField";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";
import MultipleGroupPicker from "@/components/global/pets/add_pet/MultipleGroupPicker";
import DeleteButton from "@/components/global/DeleteButton";
import { deletePetFromDb, fetchPetById, updatePetToDb } from "@/database/pets";
import { fetchGroupsForPetFromDb } from "@/database/groups";
import { deletePet, updatePet } from "@/redux/actions/petActions";
import {
  addPetToGroupAction,
  removePetFromGroupAction,
} from "@/redux/actions/groupActions";

export default function EditPetScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
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
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [initialGroups, setInitialGroups] = useState([]);

  // Get available groups from Redux.
  const availableGroups = useSelector((state) => state.groups.groups || []);

  // Load pet data (including current group memberships) when the screen mounts.
  useEffect(() => {
    async function loadPetData() {
      try {
        const pet = await fetchPetById(petId);
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
          setSelectedGroups(petGroups || []);
          setInitialGroups(petGroups || []);
        }
      } catch (error) {
        //console.error("Error loading pet details:", error);
      }
    }
    if (petId) {
      loadPetData();
    }
  }, [petId]);

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Pet name is required.");
      return;
    } else {
      setNameError("");
    }

    try {
      const updatedPet = {
        id: petId,
        name,
        category,
        species,
        morph,
        birthDate,
        weight,
        weightType,
        imageURL,
      };

      await updatePetToDb(updatedPet);
      dispatch(updatePet(updatedPet));

      // Update group links:
      const groupsToRemove = initialGroups.filter(
        (grp) => !selectedGroups.some((sGrp) => sGrp && sGrp.id === grp.id)
      );
      for (const grp of groupsToRemove) {
        await dispatch(removePetFromGroupAction(grp.id, petId));
      }
      const groupsToAdd = selectedGroups.filter(
        (grp) => !initialGroups.some((iGrp) => iGrp && iGrp.id === grp.id)
      );
      for (const grp of groupsToAdd) {
        await dispatch(addPetToGroupAction(grp.id, petId));
      }

      navigation.goBack();
    } catch (error) {
      //console.error("Error updating pet:", error);
    }
  };

  // Handler for deleting the pet.
  const handleDelete = async () => {
    try {
      // Call your database deletion function.
      await deletePetFromDb(petId);
      // Dispatch a Redux action to update state if needed.
      dispatch(deletePet(petId));
      navigation.popToTop();
    } catch (error) {
      //console.error("Error deleting pet:", error);
    }
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        onSave={handleSave}
        hasSave={true}
        onCancel={() => navigation.goBack()}
        onBack={() => navigation.goBack()}
      />
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
      <DatePickerField
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
      <MultipleGroupPicker
        selectedGroups={selectedGroups}
        setSelectedGroups={setSelectedGroups}
        availableGroups={availableGroups}
      />
      {/* Category Section */}
      <View style={styles.categorySection}>
        {/* You might include CategorySection here if needed */}
      </View>

      <CustomButton
        title="Save"
        textType="title"
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: activeColor }]}
      />
      {/* Delete Button */}
      <DeleteButton onPress={handleDelete} />

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
  categorySection: {
    marginVertical: 8,
  },
});
