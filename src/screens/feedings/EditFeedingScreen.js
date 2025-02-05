// File: EditFeedingScreen.js
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateFeeding } from "@/redux/actions";
import { selectFeedingById } from "@/redux/selectors";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "@/database";
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
import { Image } from "react-native";
import { checkImageURL } from "@/utils/checkImage";
import ExistingPetPicker from "@/components/global/pets/add_pet/ExistingPetPicker";

export default function EditFeedingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const pets = useSelector((state) => state.pets.pets || []);
  const dispatch = useDispatch();
  const { feedingId } = route.params || {};

  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  // ✅ Get feeding from Redux first
  const reduxFeeding = useSelector((state) =>
    selectFeedingById(state, feedingId)
  );
  const [feeding, setFeeding] = useState(reduxFeeding);

  useEffect(() => {
    if (!reduxFeeding) {
      const loadFeeding = async () => {
        try {
          console.log("Fetching feeding from database:", feedingId);
          const dbFeeding = await fetchFeedingByIdFromDb(feedingId);
          if (dbFeeding) {
            console.log("Database returned:", dbFeeding);
            setFeeding(dbFeeding);
          }
        } catch (error) {
          console.error("Error fetching feeding from database:", error);
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

  // ✅ Ensure feedingDate is formatted correctly
  const formattedDate = feeding.feedingDate.split("T")[0];

  // Populate fields with the fetched feeding data
  const [selectedPetId, setSelectedPetId] = useState(feeding.petId);
  const [feedingDate, setFeedingDate] = useState(formattedDate);
  const [feedingTime, setFeedingTime] = useState(feeding.feedingTime);
  const [preyType, setPreyType] = useState(feeding.preyType);
  const [preyWeight, setPreyWeight] = useState(feeding.preyWeight);
  const [preyWeightType, setPreyWeightType] = useState(feeding.preyWeightType);
  const [notes, setNotes] = useState(feeding.notes);
  const [isComplete, setIsComplete] = useState(feeding.complete);
  const [showFeedingDatePicker, setShowFeedingDatePicker] = useState(false);
  const [showFeedingTimePicker, setShowFeedingTimePicker] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || {};

  const handleSave = async () => {
    try {
      // ✅ Ensure feedingDate is formatted correctly before saving
      const formattedFeedingDate = feedingDate.split("T")[0]; // Extracts YYYY-MM-DD

      const updatedFeeding = {
        id: feeding.id,
        petId: selectedPetId,
        feedingDate: formattedFeedingDate,
        feedingTime,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        complete: isComplete ? 1 : 0,
      };

      // ✅ Update in database first
      await updateFeedingInDb(
        feeding.id,
        selectedPetId,
        formattedFeedingDate, // Ensure correct format
        feedingTime,
        preyType,
        preyWeight,
        preyWeightType,
        notes,
        isComplete ? 1 : 0
      );

      // ✅ Dispatch Redux update after DB update
      dispatch(updateFeeding(updatedFeeding));

      navigation.goBack();
    } catch (error) {
      console.error("Error updating feeding:", error);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
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
            preyType={preyType}
            setPreyType={setPreyType}
            isEditing={true}
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
