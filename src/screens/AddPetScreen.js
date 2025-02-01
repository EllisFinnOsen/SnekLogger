import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { addPetToDb } from "@/database";
import { addPet } from "@/redux/actions";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function AddPetScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [morph, setMorph] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [imageURL, setImageURL] = useState("");

  const subtleColor = useThemeColor({}, "subtle");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const textColor = useThemeColor({}, "text");

  const handleSave = async () => {
    try {
      const newPet = {
        name,
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
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add New Pet</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
          },
        ]}
        placeholder="Name"
        placeholderTextColor={iconColor} // Set placeholder text color
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
          },
        ]}
        placeholder="Species"
        placeholderTextColor={iconColor} // Set placeholder text color
        value={species}
        onChangeText={setSpecies}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
          },
        ]}
        placeholder="Morph"
        placeholderTextColor={iconColor} // Set placeholder text color
        value={morph}
        onChangeText={setMorph}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
          },
        ]}
        placeholder="Birth Date"
        placeholderTextColor={iconColor} // Set placeholder text color
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
          },
        ]}
        placeholder="Weight"
        placeholderTextColor={iconColor} // Set placeholder text color
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
          },
        ]}
        placeholder="Image URL"
        placeholderTextColor={iconColor} // Set placeholder text color
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
