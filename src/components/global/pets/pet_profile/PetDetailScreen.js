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
import FieldDisplay from "./FieldDisplay";
import DateDisplay from "./DateDisplay";

export default function PetDetailScreen({
  petName = "Name",
  petCategory,
  petSpecies,
  petMorph,
  petBirthdate,
  onEditPress,
}) {
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch(); // ✅ Store dispatch at the top

  return (
    <>
      <View style={{ height: 24 }}></View>
      <EditHeader label="Details" />
      <View style={[styles.preyRow, { borderColor: fieldColor }]}>
        <View style={styles.preyWrap}>
          <FieldDisplay
            text={petName}
            label="Name"
            iconName={"person-circle-outline"}
          />
        </View>
        <View style={styles.preyWrap}>
          <DateDisplay
            dateValue={petBirthdate}
            label="Birthdate"
            iconName={"calendar"}
          />
        </View>
      </View>
      <View style={[styles.preyRow, { borderColor: fieldColor }]}>
        <View style={styles.preyWrap}>
          <FieldDisplay
            text={petSpecies}
            label="Species"
            iconName={"person-circle-outline"}
          />
        </View>
        <View style={styles.preyWrap}>
          <FieldDisplay
            text={petMorph}
            label="Morph"
            iconName={"person-circle-outline"}
          />
        </View>
      </View>

      <CustomButton
        title="Edit Details"
        style={[styles.cancelButton, { backgroundColor: fieldColor }]}
        onPress={onEditPress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  preyRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    justifyContent: "space-between",
    marginTop: 10,
  },
  preyWrap: { width: "48%" },
  weightWrap: { width: "48%" },
  saveButton: { flex: 1, marginBottom: 8 },
  cancelButton: { marginTop: 16 },
  petImage: { width: 40, height: 40, borderRadius: 50, marginRight: 16 },
  petWrap: { flexDirection: "row", marginVertical: 30 },
});
