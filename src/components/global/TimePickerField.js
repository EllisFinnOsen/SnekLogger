import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

export default function TimePickerField({
  label = "Select Time",
  timeValue,
  setTimeValue,
  showFeedingTimePicker,
  setShowFeedingTimePicker,
  icon,
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  const formattedTime = timeValue
    ? new Date(`1970-01-01T${timeValue}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Select time";

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        {icon ? (
          <Ionicons
            style={styles.icon}
            name={icon}
            size={18}
            color={iconColor}
          />
        ) : null}
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          {label}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={[
          styles.input,
          { backgroundColor: bgColor, borderColor: iconColor },
        ]}
        onPress={() => setShowFeedingTimePicker(true)}
      >
        <ThemedText type="default" style={{ color: textColor }}>
          {formattedTime}
        </ThemedText>
      </TouchableOpacity>
      {showFeedingTimePicker && (
        <DateTimePicker
          value={timeValue ? new Date(`1970-01-01T${timeValue}`) : new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowFeedingTimePicker(false);
            if (selectedTime) {
              // Use local hours and minutes to avoid timezone conversion to UTC
              const hours = selectedTime.getHours().toString().padStart(2, "0");
              const minutes = selectedTime
                .getMinutes()
                .toString()
                .padStart(2, "0");
              setTimeValue(`${hours}:${minutes}`);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginBottom: 6,
  },
});
