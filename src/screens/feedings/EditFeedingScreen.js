// File: EditFeedingScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { selectFeedingById } from "@/redux/selectors";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import CompletionToggle from "@/components/global/feedings/CompletionToggle";
import PreyTypeField from "@/components/global/feedings/PreyTypeField";
import DateTimeFields from "@/components/global/feedings/DateTimeFields";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import NotesField from "@/components/global/pets/add_pet/NotesField";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import { checkImageURL } from "@/utils/checkImage";
import ExistingPetPicker from "@/components/global/pets/add_pet/ExistingPetPicker";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "@/database/feedings";
import { updateFeeding } from "@/redux/actions";
import {
  fetchFeedingFreezerIdFromDb,
  linkFeedingToFreezer,
} from "@/database/freezer";
import { removeFreezerLink } from "@/redux/actions"; // Redux action for freezer link removal
import { deleteFeeding } from "@/redux/actions";
import DeleteButton from "@/components/global/DeleteButton";

export default function EditFeedingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const pets = useSelector((state) => state.pets.pets || []);
  const dispatch = useDispatch();
  const { feedingId } = route.params || {};

  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  // Get feeding from Redux first
  const reduxFeeding = useSelector((state) =>
    selectFeedingById(state, feedingId)
  );
  const [feeding, setFeeding] = useState(reduxFeeding);

  // When no Redux feeding exists, fetch from DB
  useEffect(() => {
    if (!reduxFeeding) {
      const loadFeeding = async () => {
        try {
          const dbFeeding = await fetchFeedingByIdFromDb(feedingId);
          if (dbFeeding) {
            setFeeding(dbFeeding);
          }
        } catch (error) {
          // Handle error as needed
        }
      };

      loadFeeding();
    }
  }, [feedingId, reduxFeeding]);

  if (!feeding) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText>Loading feeding details...</ThemedText>
      </ThemedScrollView>
    );
  }

  // ─── EXTRACT INITIAL DATE & TIME FROM THE SINGLE feedingTimestamp ────────
  // Assume feeding.feedingTimestamp is an ISO string like "2024-02-08T08:00:00.000Z"
  const dateObj = new Date(feeding.feedingTimestamp);
  // Get date as "YYYY-MM-DD"
  const initialDate = dateObj.toISOString().split("T")[0];
  // Get time in HH:mm format
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const initialTime = `${hours}:${minutes}`;

  // ─── SET UP STATE ─────────────────────────────────────────────────────────────
  const [selectedPetId, setSelectedPetId] = useState(feeding.petId);
  const [feedingDate, setFeedingDate] = useState(initialDate);
  const [feedingTime, setFeedingTime] = useState(initialTime);
  const [preyType, setPreyType] = useState(feeding.preyType);
  const [preyWeight, setPreyWeight] = useState(feeding.preyWeight);
  const [preyWeightType, setPreyWeightType] = useState(feeding.preyWeightType);
  const [notes, setNotes] = useState(feeding.notes);
  const [isComplete, setIsComplete] = useState(feeding.complete);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false);
  const [selectedFreezerId, setSelectedFreezerId] = useState(null);
  const [pendingFreezerRemoval, setPendingFreezerRemoval] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {};

  useEffect(() => {
    const loadFreezerId = async () => {
      if (feeding?.id) {
        try {
          const freezerId = await fetchFeedingFreezerIdFromDb(feeding.id);
          setSelectedFreezerId(freezerId);
        } catch (error) {
          // Handle error as needed
        }
      }
    };

    loadFreezerId();
  }, [feeding?.id]);

  // ─── HANDLE SAVE ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      // Combine the edited date and time into a single ISO timestamp.
      const updatedFeedingTimestamp = new Date(
        `${feedingDate}T${feedingTime}`
      ).toISOString();

      // Build an updated feeding object.
      // (If your database still expects separate fields, you could also pass feedingDate and feedingTime.)
      const updatedFeeding = {
        id: feeding.id,
        petId: selectedPetId,
        feedingTimestamp: updatedFeedingTimestamp,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete: isComplete ? 1 : 0,
      };

      // Update feeding in DB. (Ensure your updateFeedingInDb function is updated to use the new feedingTimestamp.)
      await updateFeedingInDb(
        feeding.id,
        selectedPetId,
        updatedFeedingTimestamp, // Passing the single timestamp
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        isComplete ? 1 : 0
      );

      // Ensure freezer link is updated as needed.
      if (selectedFreezerId) {
        await linkFeedingToFreezer(feeding.id, selectedFreezerId);
      } else {
        await dispatch(removeFreezerLink(feeding.id));
      }

      // Dispatch Redux update.
      dispatch(updateFeeding(updatedFeeding));

      navigation.goBack();
    } catch (error) {
      // Handle error as needed
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteFeeding(feedingId));
      navigation.popToTop();
    } catch (error) {
      // Handle error as needed
    }
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        onSave={handleSave}
        hasSave={true}
        onCancel={handleCancel}
        onBack={() => navigation.goBack()}
      />
      <EditHeader
        label="Edit Feeding"
        description="Modify feeding details and press save."
      />
      <View style={styles.petWrap}>
        <Image
          source={{
            uri: checkImageURL(selectedPet.imageURL)
              ? selectedPet.imageURL
              : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
          }}
          style={styles.petImage}
        />
        <View style={[styles.fieldWrapper, { borderColor: fieldColor }]}>
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

      <View style={[styles.preyRow, { borderColor: fieldColor }]}>
        <View style={styles.preyWrap}>
          <PreyTypeField
            isEditing={true}
            preyType={preyType}
            setPreyType={setPreyType}
            onFreezerSelection={setSelectedFreezerId}
            selectedFreezerId={selectedFreezerId}
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

      {/* Pass the derived date and time to DateTimeFields */}
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
          style={[styles.cancelButton, { backgroundColor: fieldColor }]}
        />
        <DeleteButton onPress={handleDelete} />
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  buttonRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 16,
  },
  preyRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 10,
  },
  preyWrap: { width: "48%" },
  weightWrap: { width: "48%" },
  saveButton: { flex: 1, marginBottom: 8 },
  cancelButton: { marginTop: 16 },
  petImage: { width: 40, height: 40, borderRadius: 50, marginRight: 16 },
  petWrap: { flexDirection: "row", marginVertical: 30 },
});
