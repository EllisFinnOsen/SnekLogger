import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../../ThemedText";
import { SIZES } from "@/constants/Theme";

export default function HeaderSection({ onSave, onCancel, hasSave = false }) {
  const textColor = useThemeColor({}, "text");
  const activeColor = useThemeColor({}, "active");
  return (
    <View style={styles.customHeader}>
      <TouchableOpacity onPress={onCancel}>
        <Ionicons name="arrow-back" size={24} color={textColor} />
      </TouchableOpacity>
      <View style={styles.options}>
        <TouchableOpacity testID="cancel-link" onPress={onCancel}>
          <ThemedText type="smDetail" style={styles.cancelText}>
            Cancel
          </ThemedText>
        </TouchableOpacity>
        {hasSave && (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: activeColor }]}
            testID="save-link"
            onPress={onSave}
          >
            <ThemedText type="smDetail">Save</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelText: {},
  options: {
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    marginLeft: 16,
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
