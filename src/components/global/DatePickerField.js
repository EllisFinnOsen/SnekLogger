import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

export default function DatePickerField({
  label = "Select Date", // Default label
  dateValue,
  setDateValue,
  showDatePicker,
  setShowDatePicker,
  placeholder = "Select a date", // Default placeholder text
  icon = "chevron-forward-circle-outline",
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  // When a date is stored as "YYYY-MM-DD", we append "T00:00:00" so that
  // the Date object is set to midnight local time.
  const parsedDate = dateValue ? new Date(dateValue + "T00:00:00") : new Date();

  // Format date display using the locale’s date format.
  const formattedDate = dateValue
    ? parsedDate.toLocaleDateString()
    : placeholder;

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
        onPress={() => setShowDatePicker(true)}
      >
        <ThemedText type="default" style={{ color: textColor }}>
          {formattedDate}
        </ThemedText>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={parsedDate} // Ensure it always receives a Date object
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              // Instead of storing a full ISO string (which includes a time),
              // we extract and store only the date portion (YYYY-MM-DD)
              const year = selectedDate.getFullYear();
              const month = (selectedDate.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              const day = selectedDate.getDate().toString().padStart(2, "0");
              setDateValue(`${year}-${month}-${day}`);
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  icon: {
    marginBottom: 6,
  },
});
