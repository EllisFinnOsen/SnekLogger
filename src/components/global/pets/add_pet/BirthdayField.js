import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function BirthDateField({
  birthDate,
  setBirthDate,
  showDatePicker,
  setShowDatePicker,
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  const formattedBirthDate = birthDate
    ? new Date(birthDate).toLocaleDateString()
    : "Select approximate date";

  return (
    <View style={styles.fieldContainer}>
      <ThemedText type="default" style={styles.label}>
        Birth Date
      </ThemedText>
      <TouchableOpacity
        style={[
          styles.input,
          { backgroundColor: bgColor, borderColor: iconColor },
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <ThemedText type="default" style={{ color: textColor }}>
          {formattedBirthDate}
        </ThemedText>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate ? new Date(birthDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setBirthDate(selectedDate.toISOString());
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
