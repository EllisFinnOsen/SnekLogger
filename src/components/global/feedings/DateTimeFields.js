import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import DatePickerField from "@/components/global/DatePickerField";
import TimePickerField from "@/components/global/TimePickerField";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function DateTimeFields({
  feedingDate,
  setFeedingDate,
  feedingTime,
  setFeedingTime,
  showFeedingDatePicker,
  setShowFeedingDatePicker,
  showFeedingTimePicker,
  setShowTimePicker,
  isEditing,
}) {
  const iconColor = useThemeColor({}, "icon");
  const cancelColor = useThemeColor({}, "field");

  return (
    <View style={styles.dateTimeRow}>
      {/* Date Picker */}
      <View style={styles.dateWrapper}>
        <View style={[styles.inputWrapper, { borderColor: "transparent" }]}>
          {isEditing ? (
            <DatePickerField
              dateValue={feedingDate}
              setDateValue={setFeedingDate}
              showDatePicker={showFeedingDatePicker}
              setShowDatePicker={setShowFeedingDatePicker}
              placeholder="Select feeding date"
              icon="calendar"
              label="Date"
            />
          ) : (
            <>
              <View style={styles.titleContainer}>
                <Ionicons name="calendar" size={18} color={iconColor} />
                <ThemedText
                  type="default"
                  style={[styles.label, { color: iconColor }]}
                >
                  Date
                </ThemedText>
              </View>
              <ThemedText style={styles.answer} type="default">
                {feedingDate}
              </ThemedText>
            </>
          )}
        </View>
      </View>

      {/* Time Picker */}
      <View style={styles.timeWrapper}>
        <View style={[styles.inputWrapper, { borderColor: "transparent" }]}>
          {isEditing ? (
            <TimePickerField
              timeValue={feedingTime}
              setTimeValue={setFeedingTime}
              showTimePicker={showFeedingTimePicker}
              setShowTimePicker={setShowTimePicker}
              icon="time"
              label="Time"
            />
          ) : (
            <>
              <View style={styles.titleContainer}>
                <Ionicons name="time" size={18} color={iconColor} />
                <ThemedText
                  type="default"
                  style={[styles.label, { color: iconColor }]}
                >
                  Time
                </ThemedText>
              </View>
              <ThemedText style={styles.answer} type="default">
                {feedingTime}
              </ThemedText>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateWrapper: {
    width: "48%",
  },
  timeWrapper: {
    width: "48%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    marginLeft: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 12, // Padding only inside the input field
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 5,
  },
  answer: {
    paddingVertical: 12,
    borderRadius: 5,
  },
});
