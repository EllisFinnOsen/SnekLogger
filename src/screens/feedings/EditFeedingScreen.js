import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  updateFeeding,
  fetchFeedings,
  addFeedingSchedule,
  updateFeedingSchedule,
} from "@/redux/actions";
import RecurringScheduleForm from "@/components/global/feeding-schedules/RecurringScheduleForm";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "@/database";
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

export default function EditFeedingScreen() {
  // Always call your hooks at the top of the component.
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { feedingId } = route.params || {};

  // Local state for loading and fetched feeding
  const [feeding, setFeeding] = useState(null);
  const [loading, setLoading] = useState(true);

  // Other hooks (for example, theme colors and Redux state)
  const pets = useSelector((state) => state.pets.pets || []);
  const cancelColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  // Fetch the feeding record from the database when the component mounts.
  useEffect(() => {
    if (!feedingId) {
      console.error("No feedingId provided in route params");
      setLoading(false);
      return;
    }
    const fetchFeeding = async () => {
      try {
        const fetched = await fetchFeedingByIdFromDb(feedingId);
        setFeeding(fetched);
      } catch (error) {
        console.error("Error fetching feeding:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeding();
  }, [feedingId]);

  // Initialize form state.
  // (We set initial states with feeding || default values; once feeding is loaded these can be updated if needed.)
  const [selectedPetId, setSelectedPetId] = useState(
    feeding ? feeding.petId : null
  );
  const [feedingDate, setFeedingDate] = useState(
    feeding ? feeding.feedingDate : ""
  );
  const [feedingTime, setFeedingTime] = useState(
    feeding ? feeding.feedingTime : ""
  );
  const [preyType, setPreyType] = useState(
    feeding ? feeding.preyType || "" : ""
  );
  const [preyWeight, setPreyWeight] = useState(
    feeding ? feeding.preyWeight || 0 : 0
  );
  const [preyWeightType, setPreyWeightType] = useState(
    feeding ? feeding.preyWeightType || "g" : "g"
  );
  const [notes, setNotes] = useState(feeding ? feeding.notes || "" : "");
  const [isComplete, setIsComplete] = useState(
    feeding ? feeding.complete === 1 : false
  );
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false);

  // Recurring schedule state.
  const [recurringSchedule, setRecurringSchedule] = useState({
    isRecurring: feeding ? feeding.isRecurring === 1 : false,
    frequency: feeding ? feeding.frequency || "daily" : "daily",
    interval: feeding ? feeding.interval || 1 : 1,
    customUnit: feeding ? feeding.customUnit || "week" : "week",
    endType: feeding ? feeding.endType || "never" : "never",
    endDate:
      feeding && feeding.endDate ? new Date(feeding.endDate) : new Date(),
    occurrenceCount: feeding ? feeding.occurrenceCount || 0 : 0,
    scheduleId: feeding ? feeding.scheduleId || null : null,
  });

  // Determine the selected pet from Redux.
  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {};

  // Guard flag to prevent duplicate submissions.
  const [isSaving, setIsSaving] = useState(false);

  // If our form state should update when feeding is loaded, we can use an effect:
  useEffect(() => {
    if (feeding) {
      setSelectedPetId(feeding.petId);
      setFeedingDate(feeding.feedingDate);
      setFeedingTime(feeding.feedingTime);
      setPreyType(feeding.preyType || "");
      setPreyWeight(feeding.preyWeight || 0);
      setPreyWeightType(feeding.preyWeightType || "g");
      setNotes(feeding.notes || "");
      setIsComplete(feeding.complete === 1);
      setRecurringSchedule({
        isRecurring: feeding.isRecurring === 1,
        frequency: feeding.frequency || "daily",
        interval: feeding.interval || 1,
        customUnit: feeding.customUnit || "week",
        endType: feeding.endType || "never",
        endDate: feeding.endDate ? new Date(feeding.endDate) : new Date(),
        occurrenceCount: feeding.occurrenceCount || 0,
        scheduleId: feeding.scheduleId || null,
      });
    }
  }, [feeding]);

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
      let finalScheduleId = null;

      // If recurring, update or insert the schedule.
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

      console.log("Updating feeding row with recurring info:", {
        feedingId: feeding.id,
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
        feeding.id,
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
      console.log("Feeding log updated with schedule ID:", finalScheduleId);

      dispatch(
        updateFeeding({
          id: feeding.id,
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

      await dispatch(fetchFeedings());
      console.log("Feeding update process complete, navigating back.");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating feeding:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    console.log("Feeding edit cancelled.");
    navigation.goBack();
  };

  // Instead of early returning from the component, we conditionally render within the returned JSX.
  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading feeding details...</Text>
        </View>
      ) : !feeding ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: Feeding record not found.</Text>
        </View>
      ) : (
        // Main Content (all hooks have been called above)
        <>
          {/* Header Section */}
          <HeaderSection
            isEditing={true}
            onSave={handleSave}
            onCancel={handleCancel}
          />

          <EditHeader
            label="Edit Feeding"
            description="Update feeding details and press save."
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
        </>
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
  fieldWrapper: { flex: 1, borderWidth: 1, borderRadius: 4, padding: 8 },
  saveButton: { flex: 1, marginBottom: 8 },
  cancelButton: { flex: 1 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },
});
