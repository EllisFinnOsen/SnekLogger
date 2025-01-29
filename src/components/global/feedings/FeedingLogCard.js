import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
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
  const dateObj = toISODateTime(item.feedingDate, item.feedingTime);

  const [isChecked, setIsChecked] = useState(item.complete === 1);

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");

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
      //feeding//console.error("Error updating feeding:", error);
    }
  };

  return (
    <ThemedView
      style={[
        styles.wrap,
        { backgroundColor: isChecked ? fieldColor : textColor },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("EditFeeding", { feedingId: item.id })
        }
        style={[
          styles.container,
          { backgroundColor: isChecked ? fieldColor : textColor },
        ]}
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleToggleCheck();
            }}
            style={styles.toggle}
          >
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? activeColor : fieldColor}
            />
          </TouchableOpacity>
          <View style={styles.dateColumn}>
            <ThemedText
              type="smDetail"
              style={{ color: isChecked ? textColor : bgColor }}
            >
              {item.petName}
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={{ color: isChecked ? textColor : bgColor }}
            >
              {formatDateString(dateObj, "MM/DD")}
            </ThemedText>
          </View>
        </View>
        <View style={styles.details}>
          <ThemedText
            type="default"
            style={{ color: isChecked ? textColor : bgColor }}
          >
            {item.preyType}
          </ThemedText>
          <ThemedText
            type="default"
            style={{ color: isChecked ? textColor : bgColor }}
          >
            ({formatTimeString(dateObj)})
          </ThemedText>
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    borderRadius: SIZES.xSmall,
    width: "100%",
    alignItems: "center",
    padding: 16,
    marginBottom: SIZES.xxSmall,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: SIZES.xSmall,
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  toggle: {
    flexDirection: "row",
    gap: SIZES.xxSmall,
  },
  dateColumn: {
    flexDirection: "row",
  },
});
