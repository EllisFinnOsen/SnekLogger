import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
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
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedText } from "@/components/global/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomDropdown from "@/components/global/CustomDropdown";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import ExistingPetPicker from "@/components/global/pets/add_pet/ExistingPetPicker";
import DatePickerField from "@/components/global/DatePickerField";

export default function EditFeedingScreen({ route, navigation }) {
  const { feedingId } = route.params;
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);

  const [feeding, setFeeding] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedingDate, setFeedingDate] = useState("");
  const [feedingTime, setFeedingTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");

  // Load Feeding Data
  const loadFeeding = async () => {
    try {
      const currentFeeding = await fetchFeedingByIdFromDb(feedingId);

      if (currentFeeding) {
        setFeeding(currentFeeding);
        setSelectedPetId(currentFeeding.petId);
        setFeedingDate(currentFeeding.feedingDate);
        setFeedingTime(currentFeeding.feedingTime);
        setIsComplete(currentFeeding.complete === 1);
      }
    } catch (error) {
      console.error("Error loading feeding details:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFeeding();
      dispatch(fetchPets());
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
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating feeding:", error);
    }
  };

  const handleCancel = () => {
    setSelectedPetId(feeding.petId);
    setFeedingDate(feeding.feedingDate);
    setFeedingTime(feeding.feedingTime);
    setIsComplete(feeding.complete === 1);
    setIsEditing(false);
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
      console.error("Error updating feeding complete status:", error);
    }
  };

  if (!feeding) return <ThemedText>Loading feeding details...</ThemedText>;

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
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <HeaderSection
        onSave={handleSave}
        hasSave={true}
        onCancel={() => navigation.goBack()}
      />
      <EditHeader
        label="Edit Feeding"
        description="Modify feeding details and press save."
      />
      {/* Completion Toggle */}
      <View style={styles.row}>
        <Ionicons
          name={isComplete ? "checkbox" : "square-outline"}
          size={24}
          color={activeColor}
        />
        <ThemedText type="subtitle">Mark as Complete</ThemedText>
        <TouchableOpacity onPress={handleToggleCheck} style={styles.toggle}>
          <Ionicons
            name={isComplete ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Image
          source={{
            uri:
              selectedPet && selectedPet.imageURL
                ? selectedPet.imageURL
                : "https://via.placeholder.com/50",
          }}
          style={styles.petImage}
        />

        {/* Replace Dropdown with ExistingPetPicker */}
        {isEditing ? (
          <ExistingPetPicker
            items={pets.map((pet) => ({
              label: pet.name,
              value: pet.id,
              imageURL: pet.imageURL,
            }))}
            selectedValue={selectedPetId}
            onValueChange={setSelectedPetId}
          />
        ) : (
          <ThemedText type="subtitle">
            {selectedPet?.name || "Select a pet"}
          </ThemedText>
        )}
      </View>

      {/* Date & Time Inputs */}
      <View style={styles.inputGroup}>
        <Ionicons name="calendar" size={24} color={iconColor} />
        {isEditing ? (
          <DatePickerField
            label="Feeding Date"
            dateValue={feedingDate}
            setDateValue={setFeedingDate}
            showDatePicker={showFeedingDatePicker}
            setShowDatePicker={setShowFeedingDatePicker}
            placeholder="Select feeding date"
          />
        ) : (
          <ThemedText>{formattedDate}</ThemedText>
        )}
      </View>
      <View style={styles.inputGroup}>
        <Ionicons name="time" size={24} color={iconColor} />
        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={feedingTime}
            onChangeText={setFeedingTime}
          />
        ) : (
          <ThemedText>{formattedTime}</ThemedText>
        )}
      </View>
      {/* Action Buttons */}
      {isEditing ? (
        <>
          <CustomButton
            title="Save"
            textType="title"
            onPress={handleSave}
            style={styles.saveButton}
          />
          <CustomButton
            title="Cancel"
            textType="title"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
        </>
      ) : (
        <CustomButton
          title="Edit"
          textType="title"
          onPress={() => setIsEditing(true)}
        />
      )}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 6,
    flex: 1,
    marginLeft: 10,
  },
  saveButton: { marginTop: 16 },
  cancelButton: { backgroundColor: "gray", marginTop: 8 },
});
