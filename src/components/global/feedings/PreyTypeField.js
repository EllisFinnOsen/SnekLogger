import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import SearchablePicker from "@/components/global/SearchablePicker";
import { PREY_TYPES } from "@/constants/FeedingTypes";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PreyTypeField({ preyType, setPreyType, isEditing }) {
  const iconColor = useThemeColor({}, "icon");
  const cancelColor = useThemeColor({}, "field");

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Prey Type
        </ThemedText>
      </View>

      <View style={[styles.inputWrapper, { borderColor: "transparent" }]}>
        {isEditing ? (
          <SearchablePicker
            options={PREY_TYPES}
            selectedValue={preyType}
            onValueChange={setPreyType}
            placeholder="Select or enter prey type..."
            otherLabel="Other (Enter custom prey type)"
          />
        ) : (
          <ThemedText style={styles.answer} type="default">
            {preyType || "No prey type selected"}
          </ThemedText>
        )}
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
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
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
