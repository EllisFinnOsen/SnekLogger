import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { addPetToDb } from "@/database";
import { addPet } from "@/redux/actions";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";

// Import subcomponents
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import PetNameField from "@/components/global/pets/add_pet/PetNameField";
import CategorySection from "@/components/global/pets/add_pet/CategorySection";
import BirthDateField from "@/components/global/pets/add_pet/BirthdayField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import PetImageField from "@/components/global/pets/add_pet/PetImageField";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";

export default function AddPetScreen({ navigation }) {
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const errorColor = useThemeColor({}, "error");
  const activeColor = useThemeColor({}, "active");
  const textColor = useThemeColor({}, "text");
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

  const handleSave = async () => {
    // Validate pet name
    if (!name.trim()) {
      setNameError("Pet name is required.");
      return;
    } else {
      setNameError("");
    }

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

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection onCancel={() => navigation.goBack()} />
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
      <View style={styles.spacer}></View>
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
