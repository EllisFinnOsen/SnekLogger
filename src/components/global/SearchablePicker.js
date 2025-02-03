import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";

export default function SearchablePicker({
  label,
  options = [],
  selectedValue,
  onValueChange,
  placeholder = "Select an option...",
  otherLabel = "Other (Enter custom option)", // Customizable "Other" option
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const subtleColor = useThemeColor({}, "subtleText");

  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const optionsWithOther = [...filteredOptions, otherLabel];

  const handleSelect = (option) => {
    if (option === otherLabel) {
      setCustomMode(true);
    } else {
      onValueChange(option);
      closeModal();
    }
  };

  const handleCustomSubmit = () => {
    if (customText.trim() !== "") {
      onValueChange(customText);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSearchTerm("");
    setCustomMode(false);
    setCustomText("");
  };

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="default" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <TouchableOpacity
        style={[
          styles.picker,
          { backgroundColor: bgColor, borderColor: iconColor },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <ThemedText
            type="default"
            style={{ color: selectedValue ? textColor : subtleColor }}
          >
            {selectedValue || placeholder}
          </ThemedText>
          <Ionicons name="chevron-down" size={20} color={iconColor} />
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          {customMode ? (
            <View style={styles.customInputContainer}>
              <TextInput
                placeholder="Enter custom option..."
                placeholderTextColor={subtleColor}
                style={[
                  styles.customInput,
                  { color: textColor, borderColor: iconColor },
                ]}
                value={customText}
                onChangeText={setCustomText}
              />
              <TouchableOpacity
                onPress={handleCustomSubmit}
                style={styles.submitButton}
              >
                <ThemedText type="default" style={{ color: iconColor }}>
                  Submit
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <TextInput
                placeholder="Search..."
                placeholderTextColor={iconColor}
                style={[
                  styles.searchInput,
                  { color: textColor, borderColor: iconColor },
                ]}
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              <FlatList
                data={optionsWithOther}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={[styles.option, { borderBottomColor: fieldAccent }]}
                  >
                    <ThemedText type="default" style={{ color: textColor }}>
                      {item}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
          <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
            <ThemedText type="default" style={{ color: iconColor }}>
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { marginBottom: 4 },
  picker: { borderWidth: 1, borderRadius: 5, padding: 10 },
  pickerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingVertical: 48,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
    fontSize: SIZES.medium,
  },
  option: { padding: 12, borderBottomWidth: 1 },
  cancelButton: { marginTop: 16, alignSelf: "center" },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    fontSize: SIZES.small,
  },
  submitButton: { marginLeft: 8, padding: 10 },
});
