import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  addFeeding,
  fetchPets,
  addFeedingSchedule,
  updateFeeding,
  fetchFeedings,
} from "@/redux/actions";
import RecurringScheduleForm from "@/components/global/feeding-schedules/RecurringScheduleForm";
import { insertFeedingInDb, updateFeedingInDb } from "@/database";
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
  const feedingsState = useSelector((state) => state.feedings);
  console.log("Current Redux feedings state:", feedingsState);

  // Default values
  const todayDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

  // State for one-off feeding details
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

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {};

  // State for recurring schedule details
  const [recurringSchedule, setRecurringSchedule] = useState({
    isRecurring: false,
    frequency: "daily",
    interval: 1,
    customUnit: "week",
    endType: "never",
    endDate: new Date(),
    occurrenceCount: 0,
  });

  // Guard flag to prevent duplicate submissions
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) {
      console.log("Already saving, skipping duplicate submission.");
      return;
    }
    setIsSaving(true);

    if (!selectedPetId) {
      console.error("Error: No pet selected for feeding.");
      setIsSaving(false);
      return;
    }

    try {
      // Step 1: Insert the feeding row as one-off.
      const newFeeding = {
        petId: selectedPetId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete: isComplete ? 1 : 0,
        isRecurring: 0,
        scheduleId: null,
      };

      console.log("Inserting new feeding:", newFeeding);
      const feedingId = await dispatch(addFeeding(newFeeding));
      console.log("New feeding inserted with ID:", feedingId);

      let finalScheduleId = null;
      // Step 2: If recurring, insert or update the schedule.
      if (recurringSchedule.isRecurring) {
        if (recurringSchedule.scheduleId) {
          console.log("Updating existing schedule:", recurringSchedule);
          await dispatch(
            updateFeedingSchedule(recurringSchedule.scheduleId, {
              petId: selectedPetId,
              startDate: feedingDate,
              feedingTime,
              preyType,
              preyWeight,
              notes,
              frequency: recurringSchedule.frequency,
              interval: recurringSchedule.interval,
              customUnit: recurringSchedule.customUnit,
              endType: recurringSchedule.endType,
              endDate:
                recurringSchedule.endType === "on"
                  ? recurringSchedule.endDate.toISOString().split("T")[0]
                  : null,
              occurrenceCount:
                recurringSchedule.endType === "after"
                  ? recurringSchedule.occurrenceCount
                  : null,
            })
          );
          finalScheduleId = recurringSchedule.scheduleId;
        } else {
          console.log("Inserting new schedule with:", recurringSchedule);
          finalScheduleId = await dispatch(
            addFeedingSchedule({
              petId: selectedPetId,
              startDate: feedingDate,
              feedingTime,
              preyType,
              preyWeight,
              notes,
              frequency: recurringSchedule.frequency,
              interval: recurringSchedule.interval,
              customUnit: recurringSchedule.customUnit,
              endType: recurringSchedule.endType,
              endDate:
                recurringSchedule.endType === "on"
                  ? recurringSchedule.endDate.toISOString().split("T")[0]
                  : null,
              occurrenceCount:
                recurringSchedule.endType === "after"
                  ? recurringSchedule.occurrenceCount
                  : null,
            })
          );
          console.log(
            "New feeding schedule inserted with ID:",
            finalScheduleId
          );
          setRecurringSchedule((prev) => ({
            ...prev,
            scheduleId: finalScheduleId,
          }));
        }
      }

      // Step 3: Update the feeding row with recurring info.
      console.log("Updating feeding row with recurring info:", {
        feedingId,
        petId: selectedPetId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete: isComplete ? 1 : 0,
        isRecurring: recurringSchedule.isRecurring ? 1 : 0,
        scheduleId: finalScheduleId,
      });
      await updateFeedingInDb(
        feedingId,
        selectedPetId,
        feedingDate,
        feedingTime,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        isComplete ? 1 : 0,
        recurringSchedule.isRecurring ? 1 : 0,
        finalScheduleId
      );
      console.log(
        "Feeding log updated as recurring with schedule ID:",
        finalScheduleId
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
          isRecurring: recurringSchedule.isRecurring ? 1 : 0,
          scheduleId: finalScheduleId,
        })
      );

      // Optionally, re-fetch feedings to refresh Redux state.
      await dispatch(fetchFeedings());
      console.log("Feeding save process complete, navigating back.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving new feeding:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    console.log("Feeding creation cancelled.");
    navigation.goBack();
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <HeaderSection
        isEditing={true}
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
        onToggle={() => {
          console.log(
            "Toggling complete from:",
            isComplete,
            "to:",
            !isComplete
          );
          setIsComplete(!isComplete);
        }}
      />

      {/* Prey Type & Weight Selection */}
      <View style={styles.preyRow}>
        <PreyTypeField
          preyType={preyType}
          setPreyType={(val) => {
            console.log("Setting preyType to:", val);
            setPreyType(val);
          }}
          isEditing={true}
        />
        <View style={styles.weight}>
          <WeightField
            weight={preyWeight}
            setWeight={(val) => {
              console.log("Setting preyWeight to:", val);
              setPreyWeight(val);
            }}
            weightType={preyWeightType}
            setWeightType={(val) => {
              console.log("Setting preyWeightType to:", val);
              setPreyWeightType(val);
            }}
            isEditing={true}
          />
        </View>
      </View>

      {/* Date & Time Inputs */}
      <DateTimeFields
        feedingDate={feedingDate}
        setFeedingDate={(val) => {
          console.log("Setting feedingDate to:", val);
          setFeedingDate(val);
        }}
        feedingTime={feedingTime}
        setFeedingTime={(val) => {
          console.log("Setting feedingTime to:", val);
          setFeedingTime(val);
        }}
        showFeedingDatePicker={showFeedingDatePicker}
        setShowFeedingDatePicker={setShowFeedingDatePicker}
        showFeedingTimePicker={showFeedingTimePicker}
        setShowFeedingTimePicker={setShowFeedingTimePicker}
        isEditing={true}
      />

      {/* Recurring Schedule Form */}
      <RecurringScheduleForm
        schedule={recurringSchedule}
        onChange={(newSchedule) => {
          console.log("Recurring schedule updated:", newSchedule);
          setRecurringSchedule(newSchedule);
        }}
      />

      {/* Notes Field */}
      <NotesField
        notes={notes}
        setNotes={(val) => {
          console.log("Setting notes to:", val);
          setNotes(val);
        }}
        isEditing={true}
      />

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <CustomButton
          title="Save"
          textType="title"
          onPress={() => {
            console.log("Save button pressed");
            handleSave();
          }}
          style={[styles.saveButton, { backgroundColor: activeColor }]}
        />
        <CustomButton
          title="Cancel"
          textType="title"
          onPress={() => {
            console.log("Cancel button pressed");
            handleCancel();
          }}
          style={[styles.cancelButton, { backgroundColor: cancelColor }]}
        />
      </View>
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
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
});
