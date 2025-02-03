import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function DatePickerField({
  label = "Select Date", // Default label
  dateValue,
  setDateValue,
  showDatePicker,
  setShowDatePicker,
  placeholder = "Select a date", // Default placeholder text
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString()
    : placeholder;

  return (
    <View style={styles.fieldContainer}>
      <ThemedText type="default" style={styles.label}>
        {label}
      </ThemedText>
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
          value={dateValue ? new Date(dateValue) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDateValue(selectedDate.toISOString());
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
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
  },
});
