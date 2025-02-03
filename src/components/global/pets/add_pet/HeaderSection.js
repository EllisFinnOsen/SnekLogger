import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../../ThemedText";
import { SIZES } from "@/constants/Theme";

export default function HeaderSection({
  isEditing = false,
  hasSave = false, // Compatibility for EditPetPage
  onEdit,
  onSave,
  onCancel,
  onBack, // New: Decides whether to cancel edit or go back
}) {
  const textColor = useThemeColor({}, "text");
  const activeColor = useThemeColor({}, "active");

  return (
    <View style={styles.customHeader}>
      {/* Back Button: Decides whether to toggle edit or navigate back */}
      <TouchableOpacity onPress={isEditing ? onCancel : onBack}>
        <Ionicons name="arrow-back" size={24} color={textColor} />
      </TouchableOpacity>

      {/* Edit Mode Buttons */}
      <View style={styles.options}>
        {isEditing || hasSave ? (
          <>
            <TouchableOpacity testID="cancel-link" onPress={onCancel}>
              <ThemedText type="smDetail" style={styles.cancelText}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: activeColor }]}
              testID="save-link"
              onPress={onSave}
            >
              <ThemedText type="smDetail">Save</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          onEdit && (
            <TouchableOpacity testID="edit-link" onPress={onEdit}>
              <ThemedText type="smDetail" style={styles.editText}>
                Edit
              </ThemedText>
            </TouchableOpacity>
          )
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
  options: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelText: {
    marginRight: 16,
  },
  editText: {
    fontWeight: "bold",
  },
  saveButton: {
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 4,
  },
});
