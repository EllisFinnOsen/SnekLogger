// FeedingLogCard.js
import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "@/components/global/ThemedText";
import {
  toISODateTime,
  formatDateString,
  formatTimeString,
} from "@/utils/dateUtils";
import { SIZES } from "@/constants/Theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/global/ThemedView";
import { updateFeedingInDb } from "@/database";
import { updateFeeding } from "@/redux/actions";
import { Ionicons } from "@expo/vector-icons";

export default function FeedingLogCard({ item }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get the pets list from Redux state
  const pets = useSelector((state) => state.pets.pets || []);

  // Find the pet object using the feeding's petId
  const pet = pets.find((pet) => pet.id === item.petId);
  const petName = pet ? pet.name : "Unknown Pet";
  const petImageUrl = pet ? pet.imageURL : null;

  const dateObj = toISODateTime(item.feedingDate, item.feedingTime);

  const [isChecked, setIsChecked] = useState(item.complete === 1);

  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const activeColor = useThemeColor({}, "active");
  const iconColor = useThemeColor({}, "icon");

  useEffect(() => {
    setIsChecked(item.complete === 1);
  }, [item.complete]);

  const handleToggleCheck = async () => {
    const newCompleteValue = isChecked ? 0 : 1;
    try {
      await updateFeedingInDb(
        item.id,
        item.petId,
        item.feedingDate,
        item.feedingTime,
        newCompleteValue
      );
      dispatch(updateFeeding({ ...item, complete: newCompleteValue }));
      setIsChecked(!isChecked);
    } catch (error) {
      console.error("Error toggling complete status:", error);
    }
  };

  return (
    <ThemedView
      style={[
        styles.wrap,
        {
          backgroundColor: fieldColor,
          borderColor: isChecked ? fieldAccent : iconColor,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditFeeding", { feedingId: item.id })
        }
        style={styles.container}
        testID="feeding-log-card"
      >
        {/* Top Row: Pet Image, Name, and Date */}
        <View style={styles.topRow}>
          {petImageUrl && (
            <Image source={{ uri: petImageUrl }} style={styles.petImage} />
          )}
          <View style={styles.nameDateColumn}>
            <ThemedText
              type="defaultSemiBold"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              {petName}
            </ThemedText>
            <ThemedText
              type="default"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              {formatDateString(dateObj, "MM/DD")}
            </ThemedText>
          </View>
        </View>

        {/* Bottom Row: Prey Type / Time and Checkbox Toggle */}
        <View style={styles.bottomRow}>
          <View style={styles.details}>
            <ThemedText
              type="default"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              {item.preyType}
            </ThemedText>
            <ThemedText
              type="smDetail"
              style={{ color: isChecked ? iconColor : textColor }}
            >
              ({formatTimeString(dateObj)})
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              if (e && typeof e.stopPropagation === "function") {
                e.stopPropagation();
              }
              handleToggleCheck();
            }}
            style={styles.checkbox}
            testID="feeding-log-toggle"
          >
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? activeColor : textColor}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: SIZES.xSmall,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: SIZES.xxSmall,
    borderWidth: 2,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  nameDateColumn: {
    flexDirection: "column",
    marginLeft: 10,
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  details: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 16,
  },
  checkbox: {
    padding: 4,
  },
});
