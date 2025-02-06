// File: NestedSearchablePicker.js
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import PreyTypeSelectionModal from "./PreyTypeSelectionModal"; // Reuse modal component

export default function NestedSearchablePicker({
  label,
  options = [],
  selectedValue,
  onValueChange,
  placeholder = "Select an option...",
  errorMessage = "", // Error handling
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const errorColor = useThemeColor({}, "error");

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="default" style={styles.label}>
          {label}
        </ThemedText>
      )}

      {/* Picker Button */}
      <TouchableOpacity
        style={[
          styles.picker,
          {
            backgroundColor: bgColor,
            borderColor: errorMessage ? errorColor : iconColor,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <ThemedText
            type="default"
            style={{ color: selectedValue ? textColor : "gray" }}
          >
            {selectedValue || placeholder}
          </ThemedText>
          <Ionicons name="chevron-down" size={20} color={iconColor} />
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {errorMessage ? (
        <ThemedText
          type="default"
          style={[styles.errorText, { color: errorColor }]}
        >
          {errorMessage}
        </ThemedText>
      ) : null}

      {/* Reuse PreyTypeSelectionModal */}
      <PreyTypeSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        options={options}
        onSelect={(option) => {
          onValueChange(option);
          setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { marginBottom: 4 },
  picker: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
  },
  pickerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
