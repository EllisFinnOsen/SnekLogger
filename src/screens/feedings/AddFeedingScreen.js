// File: AddFeedingScreen.js
import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ThemedScrollView from "@/components/global/ThemedScrollView";
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
import { insertFeedingInDb } from "@/database/feedings";
import { addFeeding } from "@/redux/actions";
import { linkFeedingToFreezer } from "@/database/freezer";
import RecurringFields from "@/components/global/feedings/RecurringFields";
import { addRecurringFeedingAction } from "@/redux/actions/recurringFeedingActions";

export default function AddFeedingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pets = useSelector((state) => state.pets.pets || []);

  // Get today's date and the current time for initial state.
  const todayDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

  const [selectedPetId, setSelectedPetId] = useState(null);
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {};
  const [feedingDate, setFeedingDate] = useState(todayDate);
  const [feedingTime, setFeedingTime] = useState(currentTime);
  const [preyType, setPreyType] = useState("");
  const [preyWeight, setPreyWeight] = useState(0);
  const [preyWeightType, setPreyWeightType] = useState("g");
  const [notes, setNotes] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false);
  const [selectedFreezerId, setSelectedFreezerId] = useState(null);

  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState("weekly"); // 'daily', 'weekly', etc.
  const [interval, setInterval] = useState(1); // Every X weeks, days, etc.
  const [customUnit, setCustomUnit] = useState("day"); // Used if frequency is 'custom'
  const [endType, setEndType] = useState("never"); // 'never', 'on', 'after'
  const [endDate, setEndDate] = useState(""); // Used if endType is 'on'
  const [occurrenceCount, setOccurrenceCount] = useState(10); // Used if endType is 'after'

  const cancelColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  const handleSave = async () => {
    if (!selectedPetId) {
      console.error("No pet selected.");
      return;
    }

    // Combine feedingDate and feedingTime into a single ISO timestamp
    const newFeedingTimestamp = new Date(
      `${feedingDate}T${feedingTime}`
    ).toISOString();

    if (isRecurring) {
      // ─── Create a Recurring Feeding ─────────────────────────────
      const recurringFeeding = {
        petId: selectedPetId,
        frequency,
        interval,
        customUnit,
        endType,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        occurrenceCount: endType === "after" ? occurrenceCount : null,
        feedingTimestamp: newFeedingTimestamp,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
      };

      console.log("Adding Recurring Feeding:", recurringFeeding);
      dispatch(addRecurringFeedingAction(recurringFeeding));
    } else {
      // ─── Create a Regular Feeding ─────────────────────────────
      const newFeeding = {
        petId: selectedPetId,
        feedingTimestamp: newFeedingTimestamp,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete: isComplete ? 1 : 0,
      };

      try {
        const insertedId = await insertFeedingInDb(newFeeding);
        if (!insertedId) {
          console.error("Insertion failed. No ID returned.");
          return;
        }

        if (selectedFreezerId) {
          await linkFeedingToFreezer(insertedId, selectedFreezerId);
        }

        dispatch(addFeeding({ id: insertedId, ...newFeeding }));
        console.log("Feeding added, navigating back.");
      } catch (error) {
        console.error("Error in handleSave:", error);
      }
    }

    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        onSave={handleSave}
        onCancel={handleCancel}
        onBack={handleCancel}
      />
      <EditHeader
        label="Add Feeding"
        description="Fill out feeding details and press save."
      />
      <View style={styles.petWrap}>
        <Image
          source={{
            uri: checkImageURL(selectedPet.imageURL)
              ? selectedPet.imageURL
              : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
          }}
          style={[styles.petImage, { backgroundColor: cancelColor }]}
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
            isEditing={true}
          />
        </View>
      </View>
      <CompletionToggle
        isComplete={isComplete}
        onToggle={() => setIsComplete(!isComplete)}
      />
      <RecurringFields
        isRecurring={isRecurring}
        setIsRecurring={setIsRecurring}
        frequency={frequency}
        setFrequency={setFrequency}
        interval={interval}
        setInterval={setInterval}
        customUnit={customUnit}
        setCustomUnit={setCustomUnit}
        endType={endType}
        setEndType={setEndType}
        endDate={endDate}
        setEndDate={setEndDate}
        occurrenceCount={occurrenceCount}
        setOccurrenceCount={setOccurrenceCount}
      />

      <View style={styles.preyRow}>
        <View style={styles.preyWrap}>
          <PreyTypeField
            isEditing={true}
            preyType={preyType}
            setPreyType={setPreyType}
            onFreezerSelection={setSelectedFreezerId} // Capture selected freezer ID.
          />
        </View>
        <View style={styles.weightWrap}>
          <WeightField
            weight={preyWeight}
            setWeight={setPreyWeight}
            weightType={preyWeightType}
            setWeightType={setPreyWeightType}
            isEditing={true}
          />
        </View>
      </View>
      {/* DateTimeFields remains unchanged for UI editing */}
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
      <NotesField notes={notes} setNotes={setNotes} />
      <View style={styles.buttonRow}>
        <CustomButton
          title="Save"
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: activeColor }]}
        />
        <CustomButton
          title="Cancel"
          onPress={handleCancel}
          style={[styles.cancelButton, { backgroundColor: cancelColor }]}
        />
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  petImage: { width: 50, height: 50, borderRadius: 50, marginRight: 16 },
  petWrap: { flexDirection: "row", marginVertical: 30 },
  preyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  preyWrap: { width: "48%" },
  weightWrap: { width: "48%" },
  saveButton: { marginTop: 16, flex: 1, marginBottom: 8 },
  cancelButton: { marginTop: 8 },
  buttonRow: { flexDirection: "column" },
});
