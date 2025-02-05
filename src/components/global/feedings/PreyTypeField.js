import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { PREY_TYPES } from "@/constants/FeedingTypes";
import { useThemeColor } from "@/hooks/useThemeColor";
import NestedSearchablePicker from "@/components/global/NestedSearchablePicker";

export default function PreyTypeField({
  preyType,
  setPreyType,
  isEditing,
  errorMessage, // Receive error message
}) {
  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error");

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Prey Type
        </ThemedText>
      </View>

      {/* Pass errorMessage to NestedSearchablePicker */}
      <NestedSearchablePicker
        options={PREY_TYPES}
        selectedValue={preyType}
        onValueChange={setPreyType}
        placeholder="Select..."
        otherLabel="Other (Enter custom prey type)"
        errorMessage={errorMessage} // Pass error message here
      />
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
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
