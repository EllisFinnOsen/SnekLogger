import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { updateFeeding, fetchPets } from "../redux/actions";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "../database";
import { formatDateString, formatTimeString } from "../utils/dateUtils";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedText } from "@/components/global/ThemedText";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import ExistingPetPicker from "@/components/global/pets/add_pet/ExistingPetPicker";
import CompletionToggle from "@/components/global/feedings/CompletionToggle";
import PreyTypeField from "@/components/global/feedings/PreyTypeField";
import DateTimeFields from "@/components/global/feedings/DateTimeFields";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function EditFeedingScreen({ route, navigation }) {
  const { feedingId } = route.params;
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);

  const [feeding, setFeeding] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedingDate, setFeedingDate] = useState("");
  const [feedingTime, setFeedingTime] = useState("");
  const [preyType, setPreyType] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false);

  const cancelColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const fieldPadding = 12; // Standardized padding for both states

  useFocusEffect(
    React.useCallback(() => {
      const loadFeeding = async () => {
        try {
          const currentFeeding = await fetchFeedingByIdFromDb(feedingId);
          if (currentFeeding) {
            setFeeding(currentFeeding);
            setSelectedPetId(currentFeeding.petId);
            setFeedingDate(currentFeeding.feedingDate);
            setFeedingTime(currentFeeding.feedingTime);
            setPreyType(currentFeeding.preyType || "");
            setIsComplete(currentFeeding.complete === 1);
          }
        } catch (error) {
          console.error("Error loading feeding details:", error);
        }
      };

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
        preyType,
        isComplete ? 1 : 0
      );
      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          preyType,
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
    setPreyType(feeding.preyType || "");
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
        preyType,
        newCompleteValue ? 1 : 0
      );
      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          preyType,
          complete: newCompleteValue ? 1 : 0,
        })
      );
      setIsComplete(newCompleteValue);
    } catch (error) {
      console.error("Error updating feeding complete status:", error);
    }
  };

  if (!feeding) return <ThemedText>Loading feeding details...</ThemedText>;

  const formattedDate = formatDateString(feedingDate, "LONG");
  const formattedTime = formatTimeString(feedingTime);
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <HeaderSection
        onSave={handleSave}
        hasSave
        onCancel={() => navigation.goBack()}
      />
      <EditHeader
        label="Edit Feeding"
        description="Modify feeding details and press save."
      />

      {/* Pet Selection */}
      <View style={styles.section}>
        <Image
          source={{
            uri:
              selectedPet?.imageURL ||
              "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
          }}
          style={styles.petImage}
        />
        <View
          style={[
            styles.fieldWrapper,
            !isEditing && { borderColor: cancelColor, padding: fieldPadding },
          ]}
        >
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
            <ThemedText type="default">
              {selectedPet?.name || "Select a pet"}
            </ThemedText>
          )}
        </View>
      </View>

      {/* Completion Toggle */}
      <CompletionToggle isComplete={isComplete} onToggle={handleToggleCheck} />

      {/* Prey Type Selection */}
      <PreyTypeField
        preyType={preyType}
        setPreyType={setPreyType}
        isEditing={isEditing}
      />

      {/* Date & Time Inputs */}
      <DateTimeFields
        feedingDate={feedingDate}
        setFeedingDate={setFeedingDate}
        feedingTime={feedingTime}
        setFeedingTime={setFeedingTime}
        showFeedingDatePicker={showFeedingDatePicker}
        setShowFeedingDatePicker={setShowFeedingDatePicker}
        showFeedingTimePicker={showFeedingTimePicker}
        setShowFeedingTimePicker={setShowFeedingTimePicker}
        isEditing={isEditing}
      />

      {/* Action Buttons */}
      {isEditing ? (
        <View style={styles.buttonRow}>
          <CustomButton
            title="Save"
            textType="title"
            onPress={handleSave}
            style={[styles.saveButton, { backgroundColor: activeColor }]}
          />
          <CustomButton
            title="Cancel"
            textType="title"
            onPress={handleCancel}
            style={[styles.cancelButton, { backgroundColor: cancelColor }]}
          />
        </View>
      ) : (
        <CustomButton
          title="Edit"
          textType="title"
          onPress={() => setIsEditing(true)}
          style={[styles.cancelButton, { backgroundColor: cancelColor }]}
        />
      )}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  section: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  petImage: { width: 40, height: 40, borderRadius: 50, marginRight: 16 },
  fieldWrapper: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "column",
    marginTop: 16,
  },
  saveButton: { flex: 1, marginBottom: 8 },
  cancelButton: { flex: 1 },
});
