import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { addFeeding, fetchPets } from "@/redux/actions";
import { insertFeedingInDb } from "@/database";
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
import { checkImageURL } from "@/utils/checkImage";

export default function AddFeedingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pets = useSelector((state) => state.pets.pets || []);

  // Default values
  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5); // HH:MM

  // State
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [feedingDate, setFeedingDate] = useState(todayDate);
  const [feedingTime, setFeedingTime] = useState(currentTime);
  const [preyType, setPreyType] = useState("");
  const [preyWeight, setPreyWeight] = useState(0);
  const [preyWeightType, setPreyWeightType] = useState("g");
  const [notes, setNotes] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false);

  const cancelColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  // ✅ Find the selected pet based on selectedPetId
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {};

  const handleSave = async () => {
    if (!selectedPetId) {
      console.error("Error: No pet selected for feeding.");
      return;
    }

    const newFeeding = {
      petId: selectedPetId,
      feedingDate,
      feedingTime,
      preyType,
      preyWeight,
      preyWeightType,
      notes,
      complete: isComplete ? 1 : 0,
    };

    dispatch(addFeeding(newFeeding)); // ✅ Dispatch the action
    navigation.goBack(); // ✅ Navigate back after saving
  };

  const handleCancel = () => {
    navigation.goBack(); // Discard changes and go back
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <HeaderSection
        isEditing={true} // Always start in editing mode
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <EditHeader
        label="Add Feeding"
        description="Fill out feeding details and press save."
      />

      {/* Pet Selection */}
      <View style={styles.section}>
        <Image
          source={{
            uri: checkImageURL(selectedPet.imageURL)
              ? selectedPet.imageURL
              : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
          }}
          style={styles.petImage}
        />
        <View style={[styles.fieldWrapper, { borderColor: cancelColor }]}>
          <ExistingPetPicker
            items={pets.map((pet) => ({
              label: pet.name,
              value: pet.id,
              imageURL: pet.imageURL,
            }))}
            selectedValue={selectedPetId}
            onValueChange={setSelectedPetId}
          />
        </View>
      </View>

      {/* Completion Toggle */}
      <CompletionToggle
        isComplete={isComplete}
        onToggle={() => setIsComplete(!isComplete)}
      />

      {/* Prey Type & Weight Selection */}
      <View style={styles.preyRow}>
        <PreyTypeField
          preyType={preyType}
          setPreyType={setPreyType}
          isEditing={true}
        />
        <WeightField
          weight={preyWeight}
          setWeight={setPreyWeight}
          weightType={preyWeightType}
          setWeightType={setPreyWeightType}
          isEditing={true}
        />
      </View>

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
        isEditing={true}
      />

      {/* Notes Field */}
      <NotesField notes={notes} setNotes={setNotes} isEditing={true} />

      {/* Action Buttons */}
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
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  preyRow: { flexDirection: "row", justifyContent: "space-between" },
  petImage: { width: 40, height: 40, borderRadius: 50, marginRight: 16 },
  section: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  saveButton: { flex: 1, marginBottom: 8 },
  cancelButton: { flex: 1 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
});
