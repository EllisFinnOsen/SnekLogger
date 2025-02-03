import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPetToDb } from "@/database";
import { addPet, addPetToGroupAction, fetchGroups } from "@/redux/actions";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";

// Import subcomponents
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import PetNameField from "@/components/global/pets/add_pet/PetNameField";
import DatePickerField from "@/components/global/DatePickerField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import PetImageField from "@/components/global/pets/add_pet/PetImageField";
import CategorySection from "@/components/global/pets/add_pet/CategorySection";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";
import MultipleGroupPicker from "@/components/global/pets/add_pet/MultipleGroupPicker";

export default function AddPetScreen({ navigation, route }) {
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const errorColor = useThemeColor({}, "error");
  const activeColor = useThemeColor({}, "active");
  const dispatch = useDispatch();

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

  // New state for multiple group selection.
  // This will be an array of group objects (or null for empty fields)
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Fetch available groups from Redux.
  const availableGroups = useSelector((state) => state.groups.groups || []);
  //console.log("Available Groups:", availableGroups);

  // Dispatch fetchGroups so that the available groups list is populated.
  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  // If a groupId was passed via route parameters (from navigation), pre-select that group.
  const routeGroupId = route.params && route.params.groupId;
  useEffect(() => {
    if (routeGroupId && availableGroups.length > 0) {
      const foundGroup = availableGroups.find((g) => g.id === routeGroupId);
      if (foundGroup) {
        setSelectedGroups([foundGroup]); // Pre-select that group.
      }
    }
  }, [routeGroupId, availableGroups]);

  const handleSave = async () => {
    // Validate pet name
    if (!name.trim()) {
      setNameError("Pet name is required.");
      return;
    } else {
      setNameError("");
    }

    // Construct the new pet object.
    const newPet = {
      name,
      category,
      species,
      morph,
      birthDate,
      weight,
      weightType,
      imageURL,
      // Optionally, you might store group ids here if needed:
      // groups: selectedGroups.filter(Boolean).map((g) => g.id),
    };

    try {
      // Insert the pet into the pets table.
      const petId = await addPetToDb(newPet);
      //console.log("New pet ID:", petId);
      if (!petId) {
        //console.error("Invalid petId returned from addPetToDb");
        return;
      }
      // Update Redux state for pets.
      dispatch(addPet({ ...newPet, id: petId }));

      // For each selected group, link the pet.
      const groupsToLink = selectedGroups.filter((g) => g !== null);
      for (const grp of groupsToLink) {
        await dispatch(addPetToGroupAction(grp.id, petId));
      }

      navigation.goBack();
    } catch (error) {
      //console.error("Error adding pet:", error);
    }
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection hasSave={false} onCancel={() => navigation.goBack()} />
      <EditHeader
        label="Add New Pet"
        description="Enter the listed details and press save to add a new pet."
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
