import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { addPetToDb } from "@/database";
import { addPet } from "@/redux/actions";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";

export default function AddPetScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [morph, setMorph] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [imageURL, setImageURL] = useState("");

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
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Species"
        value={species}
        onChangeText={setSpecies}
      />
      <TextInput
        style={styles.input}
        placeholder="Morph"
        value={morph}
        onChangeText={setMorph}
      />
      <TextInput
        style={styles.input}
        placeholder="Birth Date"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
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
    borderColor: "#ddd",
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
});
