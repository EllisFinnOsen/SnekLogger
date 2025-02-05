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
import { addFeeding } from "@/redux/actions/feedingActions";

export default function AddFeedingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const pets = useSelector((state) => state.pets.pets || []);

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

  const cancelColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  const handleSave = async () => {
    if (!selectedPetId) {
      console.error("Error: No pet selected for feeding.");
      return;
    }

    // ✅ Ensure feedingDate is always in `YYYY-MM-DD` format
    const formattedDate = feedingDate.split("T")[0];

    const newFeeding = {
      petId: selectedPetId,
      feedingDate: formattedDate, // ✅ Ensures proper format
      feedingTime,
      preyType,
      preyWeight,
      preyWeightType,
      notes,
      complete: isComplete ? 1 : 0,
    };

    try {
      // ✅ Insert into database first
      const insertedId = await insertFeedingInDb(newFeeding);
      if (!insertedId) {
        console.error("Error inserting feeding into database.");
        return;
      }

      // ✅ Dispatch Redux action only after successful DB write
      dispatch(addFeeding({ id: insertedId, ...newFeeding }));

      console.log("Feeding added successfully:", newFeeding);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding feeding:", error);
    }
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
            isEditing={true}
          />
        </View>
      </View>

      <CompletionToggle
        isComplete={isComplete}
        onToggle={() => setIsComplete(!isComplete)}
      />

      <View style={styles.preyRow}>
        <View style={styles.preyWrap}>
          <PreyTypeField
            isEditing={true}
            preyType={preyType}
            setPreyType={setPreyType}
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
          style={[styles.cancelButton, { backgroundColor: cancelColor }]}
        />
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  petImage: { width: 40, height: 40, borderRadius: 50, marginRight: 16 },
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
