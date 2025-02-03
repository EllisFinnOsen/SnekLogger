import React from "react";
import { View, StyleSheet } from "react-native";
import CustomButton from "@/components/global/CustomButton";

export default function EditFeedingActions({
  isEditing,
  onSave,
  onCancel,
  setIsEditing,
}) {
  return (
    <View style={styles.actionsContainer}>
      {isEditing ? (
        <>
          <CustomButton
            title="Save"
            textType="title"
            onPress={onSave}
            style={styles.saveButton}
          />
          <CustomButton
            title="Cancel"
            textType="title"
            onPress={onCancel}
            style={styles.cancelButton}
          />
        </>
      ) : (
        <CustomButton
          title="Edit"
          textType="title"
          onPress={() => setIsEditing(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    marginTop: 16,
  },
  saveButton: {
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: "gray",
  },
});
