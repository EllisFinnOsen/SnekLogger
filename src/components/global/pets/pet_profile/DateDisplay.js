import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function DateDisplay({
  dateValue,
  iconName,
  placeholder = "00/00/00",
  label = "Prey Weight",
}) {
  const iconColor = useThemeColor({}, "icon");
  // When a date is stored as "YYYY-MM-DD", we append "T00:00:00" so that
  // the Date object is set to midnight local time.
  const parsedDate = dateValue ? new Date(dateValue + "T00:00:00") : new Date();
  // If dateValue is a string in "YYYY-MM-DD" format, split and reassemble it.
  const formattedDate = dateValue
    ? parsedDate.toLocaleDateString()
    : placeholder;

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons
          style={styles.icon}
          name={iconName}
          size={18}
          color={iconColor}
        />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          {label}
        </ThemedText>
      </View>

      <View style={styles.valueContainer}>
        <ThemedText type="default">
          {dateValue ? formattedDate : "Not Set"}
        </ThemedText>
      </View>
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
    marginBottom: 6,
  },
  label: {
    marginLeft: 6,
  },
  icon: {
    marginRight: 6,
  },
  valueContainer: {
    borderRadius: 5,
    paddingVertical: 10,
  },
});
