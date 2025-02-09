// File: FeedingScreen.js
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import EditHeader from "@/components/global/EditHeader";
import CompletionToggle from "@/components/global/feedings/CompletionToggle";
import PreyTypeField from "@/components/global/feedings/PreyTypeField";
import DateTimeFields from "@/components/global/feedings/DateTimeFields";
import CustomButton from "@/components/global/CustomButton";
import { ThemedText } from "@/components/global/ThemedText";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import NotesField from "@/components/global/pets/add_pet/NotesField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import { useThemeColor } from "@/hooks/useThemeColor";
import { checkImageURL } from "@/utils/checkImage";
import { updateFeeding } from "@/redux/actions";
import { fetchFeedingByIdFromDb, updateFeedingInDb } from "@/database/feedings";
import { fetchFeedingFreezerIdFromDb } from "@/database/freezer";
import PreyDisplay from "@/components/global/feedings/PreyDisplay";
import WeightDisplay from "@/components/global/feedings/WeightDisplay";
import useFormattedDate from "@/hooks/useFormattedDate";

export default function FeedingScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch(); // ✅ Store dispatch at the top
  const { feedingId } = route.params || {};
  const pets = useSelector((state) => state.pets.pets || []);
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");

  const [localFeeding, setLocalFeeding] = useState(null);
  const [isComplete, setIsComplete] = useState(null);

  const feedings = useSelector((state) => state.feedings.feedings || []);
  const feedingFromRedux = feedings.find((f) => f.id === feedingId) || null;
  const freezerLinks = useSelector((state) => state.freezer.freezerLinks);
  const [selectedFreezerId, setSelectedFreezerId] = useState(null);

  // Function to fetch feeding details from the database
  const loadFeeding = async () => {
    try {
      //console.log("Fetching feeding from database:", feedingId);
      const dbFeeding = await fetchFeedingByIdFromDb(feedingId);
      //console.log("Database returned:", dbFeeding);
      if (dbFeeding) {
        setLocalFeeding(dbFeeding);
        setIsComplete(dbFeeding.complete);
      }
    } catch (error) {
      //console.error("Error fetching feeding from database:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadFeedingData = async () => {
        try {
          //console.log("Fetching feeding from database:", feedingId);
          const dbFeeding = await fetchFeedingByIdFromDb(feedingId);
          if (dbFeeding) {
            setLocalFeeding(dbFeeding);
            setIsComplete(dbFeeding.complete);

            // ✅ Fetch freezer ID linked to this feeding
            const freezerId = await fetchFeedingFreezerIdFromDb(feedingId);
            setSelectedFreezerId(freezerId);
          }
        } catch (error) {
          //console.error("Error fetching feeding details:", error);
        }
      };

      loadFeedingData();
    }, [feedingId])
  );

  const feeding = feedingFromRedux || localFeeding;

  const formattedFeedingDate = useFormattedDate(
    feeding?.feedingTimestamp,
    "P" // "P" gives the locale-specific date (e.g. 02/08/2024)
  );
  const formattedFeedingTime = useFormattedDate(
    feeding?.feedingTimestamp,
    "p" // "p" gives the locale-specific time (e.g. 8:00 AM)
  );

  const handleToggleComplete = async () => {
    if (!feeding) return;

    try {
      const newCompleteValue = isComplete ? 0 : 1;

      await updateFeedingInDb(
        feeding.id,
        feeding.petId,
        feeding.feedingTimestamp,
        feeding.preyType,
        feeding.preyWeight,
        feeding.preyWeightType,
        feeding.notes,
        newCompleteValue
      );

      dispatch(updateFeeding({ ...feeding, complete: newCompleteValue }));

      setIsComplete(newCompleteValue);

      // ✅ Refetch feeding details to ensure UI updates
      await loadFeeding();
    } catch (error) {
      //console.error("Error updating feeding completion status:", error);
    }
  };

  if (!feeding) {
    return (
      <ThemedScrollView contentContainerStyle={styles.container}>
        <ThemedText>Loading feeding details...</ThemedText>
      </ThemedScrollView>
    );
  }

  const pet = pets.find((pet) => pet.id === feeding.petId) || {};
  const petName = pet.name || "Unknown Pet";
  const petImage = checkImageURL(pet.imageURL)
    ? pet.imageURL
    : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D";

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        isEditing={false}
        onEdit={() => navigation.navigate("EditFeedingScreen", { feedingId })}
        onCancel={() => {}}
        onBack={() => navigation.goBack()}
      />
      <EditHeader
        label="Feeding Details"
        description="View feeding details below."
      />

      <View style={styles.petWrap}>
        <Image source={{ uri: petImage }} style={styles.petImage} />
        <View style={[styles.fieldWrapper, { borderColor: fieldColor }]}>
          <ThemedText type="default">{petName}</ThemedText>
        </View>
      </View>

      <CompletionToggle
        isComplete={isComplete}
        onToggle={handleToggleComplete}
      />

      <View style={[styles.preyRow, { borderColor: fieldColor }]}>
        <View style={styles.preyWrap}>
          <PreyDisplay
            preyType={feeding.preyType}
            selectedFreezerId={selectedFreezerId}
          />
        </View>
        <View style={styles.weightWrap}>
          <WeightDisplay
            weight={feeding.preyWeight}
            weightType={feeding.preyWeightType}
          />
        </View>
      </View>

      <DateTimeFields
        feedingDate={formattedFeedingDate}
        feedingTime={formattedFeedingTime}
      />

      <NotesField notes={feeding.notes} isEditing={false} />

      <CustomButton
        title="Edit Feeding"
        style={[styles.cancelButton, { backgroundColor: fieldColor }]}
        onPress={() => navigation.navigate("EditFeedingScreen", { feedingId })}
      />
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 0 },
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
