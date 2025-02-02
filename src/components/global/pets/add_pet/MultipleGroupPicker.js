// MultipleGroupPicker.jsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import GroupPickerField from "./GroupPickerField"; // Your single-group picker component
import { ThemedText } from "@/components/global/ThemedText";

export default function MultipleGroupPicker({
  selectedGroups,
  setSelectedGroups,
  availableGroups,
}) {
  // For each field, filter out groups already selected in other fields.
  // This helper function returns a filtered list for the current field.
  const getFilteredGroups = (currentIndex) => {
    return availableGroups.filter((group) => {
      // Exclude any group that is selected in a different field
      return !selectedGroups.some(
        (sel, idx) => idx !== currentIndex && sel && sel.id === group.id
      );
    });
  };

  const handleChange = (index, newGroup) => {
    const updated = [...selectedGroups];
    updated[index] = newGroup;
    setSelectedGroups(updated);
  };

  const handleAddField = () => {
    // Append a new empty field.
    setSelectedGroups([...selectedGroups, null]);
  };

  const handleRemoveField = (index) => {
    const updated = selectedGroups.filter((_, i) => i !== index);
    setSelectedGroups(updated);
  };

  return (
    <View style={styles.container}>
      {selectedGroups.map((group, index) => (
        <View key={index} style={styles.fieldContainer}>
          <GroupPickerField
            group={group}
            setGroup={(g) => handleChange(index, g)}
            // Pass filtered groups for the current field
            groups={getFilteredGroups(index)}
          />
          <TouchableOpacity
            onPress={() => handleRemoveField(index)}
            style={styles.removeButton}
          >
            <ThemedText type="default">Remove</ThemedText>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={handleAddField} style={styles.addButton}>
        <ThemedText type="default">Add Group</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  removeButton: {
    marginLeft: 8,
  },
  addButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    alignItems: "center",
  },
});
