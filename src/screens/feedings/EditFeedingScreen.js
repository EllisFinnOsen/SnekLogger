import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { formatDateString, formatTimeString } from "@/utils/dateUtils";
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
import WeightField from "@/components/global/pets/add_pet/WeightField";
import NotesField from "@/components/global/pets/add_pet/NotesField";
import { updateFeeding } from "@/redux/actions";
import { updateFeedingInDb } from "@/database";

export default function EditFeedingScreen({ route, navigation }) {
  const { feedingId } = route.params;
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets || []);

  const [feeding, setFeeding] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedingDate, setFeedingDate] = useState("");
  const [feedingTime, setFeedingTime] = useState("");
  const [preyType, setPreyType] = useState("");
  const [preyWeight, setPreyWeight] = useState(0);
  const [preyWeightType, setPreyWeightType] = useState("g");
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false); // ✅ Ensure this is defined

  const [initialFeeding, setInitialFeeding] = useState(null);

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
            setInitialFeeding(currentFeeding); // Store a copy for reset
            setSelectedPetId(currentFeeding.petId);
            setFeedingDate(currentFeeding.feedingDate);
            setFeedingTime(currentFeeding.feedingTime);
            setPreyType(currentFeeding.preyType || "");
            setPreyWeightType(currentFeeding.preyWeightType || "");
            setPreyWeight(currentFeeding.preyWeight || 0);
            setNotes(currentFeeding.notes || "");
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
    if (!selectedPetId) {
      console.error("Error: No pet selected for feeding update.");
      return;
    }

    try {
      await updateFeedingInDb(
        feedingId,
        selectedPetId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight ?? 0,
        preyWeightType,
        notes,
        isComplete ? 1 : 0
      );

      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          preyType,
          preyWeight,
          preyWeightType,
          notes,
          complete: isComplete ? 1 : 0,
        })
      );

      setInitialFeeding({
        // Save the new state for future resets
        petId: selectedPetId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete: isComplete ? 1 : 0,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating feeding:", error);
    }
  };

  const handleCancel = () => {
    if (initialFeeding) {
      setSelectedPetId(initialFeeding.petId);
      setFeedingDate(initialFeeding.feedingDate || "");
      setFeedingTime(initialFeeding.feedingTime || "");
      setPreyType(initialFeeding.preyType || "");
      setPreyWeight(initialFeeding.preyWeight ?? 0);
      setPreyWeightType(initialFeeding.preyWeightType || "g");
      setNotes(initialFeeding.notes || "");
      setIsComplete(initialFeeding.complete === 1);
    }
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
        preyWeight ?? 0,
        preyWeightType ?? "g",
        notes, // Moved here instead of being after a comma
        newCompleteValue ? 1 : 0
      );
      dispatch(
        updateFeeding({
          id: feedingId,
          petId: selectedPetId,
          feedingDate,
          feedingTime,
          preyType,
          preyWeight: preyWeight ?? 0,
          preyWeightType: preyWeightType ?? "g",
          notes,
          complete: newCompleteValue ? 1 : 0,
        })
      );
      setIsComplete(newCompleteValue);
    } catch (error) {
      console.error("Error updating feeding complete status:", error);
    }
  };

  if (!feeding) return <ThemedText>Loading feeding details...</ThemedText>;
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {}; // Ensure it's at least an empty object

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <HeaderSection
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)} // Stop editing, but don't navigate
        onBack={() => navigation.goBack()} // Navigate only if not editing
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

      {/* Prey Type & Weight Selection */}
      <View style={styles.preyRow}>
        <PreyTypeField
          preyType={preyType}
          setPreyType={setPreyType}
          isEditing={isEditing}
        />
        <View style={styles.weight}>
          <WeightField
            weight={preyWeight}
            setWeight={setPreyWeight}
            weightType={preyWeightType}
            setWeightType={setPreyWeightType}
            isEditing={isEditing}
          />
        </View>
      </View>

      {/* Date & Time Inputs */}
      <DateTimeFields
        feedingDate={feedingDate}
        setFeedingDate={setFeedingDate}
        feedingTime={feedingTime}
        setFeedingTime={setFeedingTime}
        showFeedingDatePicker={showFeedingDatePicker}
        setShowFeedingDatePicker={setShowFeedingDatePicker}
        showFeedingTimePicker={showFeedingTimePicker} // ✅ Ensure this is passed correctly
        setShowFeedingTimePicker={setShowFeedingTimePicker} // ✅ Ensure the function is passed correctly
        isEditing={isEditing}
      />

      {/* Notes Field */}
      <NotesField notes={notes} setNotes={setNotes} isEditing={isEditing} />
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
  preyRow: { flexDirection: "row", justifyContent: "flex-start" },
  weight: { paddingLeft: 48 },
  petImage: { width: 40, height: 40, borderRadius: 50, marginRight: 16 },
  section: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  saveButton: { flex: 1, marginBottom: 8 },
  cancelButton: { flex: 1 },
});
