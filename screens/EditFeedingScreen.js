import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { updateFeeding, fetchPets } from "../redux/actions";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "../database";
import { Picker } from "@react-native-picker/picker";
// 1) Import the utility functions
import {
  toISODateTime,
  formatDateString,
  formatTimeString,
} from "../utils/dateUtils";

export default function EditFeedingScreen({ route, navigation }) {
  const { feedingId } = route.params;
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);
  const [feeding, setFeeding] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedingDate, setFeedingDate] = useState("");
  const [feedingTime, setFeedingTime] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [isComplete, setIsComplete] = useState(false); // State to manage the complete field

  // Load the feeding details
  const loadFeeding = async () => {
    try {
      // Fetch the specific feeding by its ID
      const currentFeeding = await fetchFeedingByIdFromDb(feedingId);

      if (currentFeeding) {
        setFeeding(currentFeeding);
        setSelectedPetId(currentFeeding.petId);
        setFeedingDate(currentFeeding.feedingDate);
        setFeedingTime(currentFeeding.feedingTime);
        setIsComplete(currentFeeding.complete === 1); // Set the initial state of the complete field
      } else {
        console.error("Feeding not found for ID:", feedingId);
      }
    } catch (error) {
      console.error("Error loading feeding details:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFeeding();
      dispatch(fetchPets()); // Fetch pets for the picker
    }, [dispatch, feedingId])
  );

  const handleSave = async () => {
    try {
      await updateFeedingInDb(
        feedingId,
        selectedPetId,
        feedingDate,
        feedingTime,
        isComplete ? 1 : 0
      );
      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          complete: isComplete ? 1 : 0,
        })
      );
      setFeeding({
        id: feedingId,
        petId: selectedPetId,
        feedingDate,
        feedingTime,
        complete: isComplete ? 1 : 0,
      }); // Update the feeding state with new values
      setIsEditing(false); // After saving, switch to view mode
    } catch (error) {
      console.error("Error updating feeding:", error);
    }
  };

  const handleCancel = () => {
    // Reset to the original feeding values (no changes)
    setSelectedPetId(feeding.petId);
    setFeedingDate(feeding.feedingDate);
    setFeedingTime(feeding.feedingTime);
    setIsComplete(feeding.complete === 1);
    setIsEditing(false); // Switch back to view mode
  };

  if (!feeding) return <Text>Loading feeding details...</Text>;

  // 5) Convert to Date object for display formatting
  const feedingDateObj = toISODateTime(
    feeding.feedingDate,
    feeding.feedingTime
  );
  // Attempt to format them if valid
  const formattedDate = feedingDateObj
    ? formatDateString(feedingDateObj, "LONG") // or 'MM/DD', 'MM/DD/YY', etc.
    : feeding.feedingDate; // fallback

  const formattedTime = feedingDateObj
    ? formatTimeString(feedingDateObj)
    : feeding.feedingTime; // fallback

  return (
    <View style={styles.container}>
      <Text>Edit Feeding</Text>

      {isEditing ? (
        <>
          <Picker
            selectedValue={selectedPetId}
            onValueChange={(itemValue) => setSelectedPetId(itemValue)}
          >
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={feedingDate}
            onChangeText={(text) => setFeedingDate(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={feedingTime}
            onChangeText={(text) => setFeedingTime(text)}
          />
          <View style={styles.switchContainer}>
            <Text>Complete:</Text>
            <Switch
              value={isComplete}
              onValueChange={setIsComplete}
              disabled={!isEditing}
            />
          </View>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={handleCancel} color="gray" />
        </>
      ) : (
        <>
          <Text>ID: {feeding.id}</Text>
          <Text>Pet: {pets.find((pet) => pet.id === feeding.petId)?.name}</Text>
          <Text>Date: {formattedDate}</Text>
          <Text>Time: {formattedTime}</Text>
          <Text>Complete? {feeding.complete === 1 ? "Yes" : "No"}</Text>

          {/* Edit link */}
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
  editLink: {
    color: "blue",
    marginTop: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
});
