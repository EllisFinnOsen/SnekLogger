import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { updateFeeding, fetchPets } from "../redux/actions";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "../database";
import {
  toISODateTime,
  formatDateString,
  formatTimeString,
} from "../utils/dateUtils";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomDropdown from "@/components/global/CustomDropdown";
import { SIZES } from "@/constants/Theme";

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
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");

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
        //console.error("Feeding not found for ID:", feedingId);
      }
    } catch (error) {
      //console.error("Error loading feeding details:", error);
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
      //console.error("Error updating feeding:", error);
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

  const handleToggleCheck = async () => {
    try {
      const newCompleteValue = !isComplete;
      await updateFeedingInDb(
        feedingId,
        selectedPetId,
        feedingDate,
        feedingTime,
        newCompleteValue ? 1 : 0
      );
      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          complete: newCompleteValue ? 1 : 0,
        })
      );
      setIsComplete(newCompleteValue);
    } catch (error) {
      //console.error("Error updating feeding complete status:", error);
    }
  };

  if (!feeding) return <Text>Loading feeding details...</Text>;

  const feedingDateObj = toISODateTime(
    feeding.feedingDate,
    feeding.feedingTime
  );
  const formattedDate = feedingDateObj
    ? formatDateString(feedingDateObj, "LONG")
    : feeding.feedingDate;
  const formattedTime = feedingDateObj
    ? formatTimeString(feedingDateObj)
    : feeding.feedingTime;

  return (
    <ThemedView>
      <Text>Edit Feeding</Text>

      <ThemedView style={styles.container}>
        <View style={styles.detailWrap}>
          <View style={styles.iconWrap}>
            <Image
              source={{
                uri: pets.find((pet) => pet.id === feeding.petId)?.imageURL,
              }}
              style={styles.petImage}
            />
          </View>
          {isEditing ? (
            <CustomDropdown
              items={pets.map((pet) => ({
                label: pet.name,
                value: pet.id,
                imageURL: pet.imageURL,
              }))}
              selectedValue={selectedPetId}
              onValueChange={setSelectedPetId}
            />
          ) : (
            <ThemedText>
              {pets.find((pet) => pet.id === feeding.petId)?.name}
            </ThemedText>
          )}
        </View>
        <View style={styles.detailWrap}>
          <View style={styles.iconWrap}>
            <Ionicons
              style={styles.icon}
              name={isComplete ? "ellipse" : "ellipse"}
              size={24}
              color={isComplete ? activeColor : fieldColor}
            />
            <ThemedText type="subtitle">Complete?</ThemedText>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleToggleCheck();
            }}
            style={styles.toggle}
          >
            <Ionicons
              name={isComplete ? "checkbox" : "square-outline"}
              size={24}
              color={isComplete ? activeColor : textColor}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.detailWrap}>
          <View style={styles.iconWrap}>
            <Ionicons
              style={styles.icon}
              name={"calendar"}
              size={24}
              color={iconColor}
            />
            <ThemedText type="subtitle">Date:</ThemedText>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={feedingDate}
              onChangeText={(text) => setFeedingDate(text)}
            />
          ) : (
            <ThemedText>{formattedDate}</ThemedText>
          )}
        </View>
        <View style={styles.detailWrap}>
          <View style={styles.iconWrap}>
            <Ionicons
              style={styles.icon}
              name={"time"}
              size={24}
              color={iconColor}
            />
            <ThemedText type="subtitle">Time:</ThemedText>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Time"
              value={feedingTime}
              onChangeText={(text) => setFeedingTime(text)}
            />
          ) : (
            <ThemedText>{formattedTime}</ThemedText>
          )}
        </View>

        {isEditing ? (
          <>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCancel} color="gray" />
          </>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
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
  detailWrap: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  iconWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.small,
    marginRight: 16,
  },
});
