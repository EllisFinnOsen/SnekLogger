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

export default function NestedSearchablePicker({
  label,
  options = [],
  freezerItems = [],
  selectedValue,
  onValueChange,
  onFreezerConfirm, // Callback for linking freezer item
  onFreezerDecline,
  placeholder = "Select an option...",
  otherLabel = "Other (Enter custom option)",
  errorMessage = "",
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const subtleColor = useThemeColor({}, "subtleText");
  const errorColor = useThemeColor({}, "error");

  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedPrey, setSelectedPrey] = useState(null);
  const [matchingFreezerItem, setMatchingFreezerItem] = useState(null);

  // Filter categories based on search term
  const filteredCategories = options.filter(({ category }) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCategory = (categoryObject) => {
    if (!categoryObject) return;
    if (categoryObject.category === otherLabel) {
      setCustomMode(true);
    } else {
      setSelectedCategory(categoryObject);
    }
  };

  const handleSelectOption = (option) => {
    onValueChange(option); // Only send selected prey type
    closeModal();
  };

  const handleCustomSubmit = () => {
    if (customText.trim() !== "") {
      onValueChange(customText);
      closeModal();
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSearchTerm("");
    setSelectedCategory(null);
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
            style={{ color: selectedValue ? textColor : subtleColor }}
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

      {/* Modal for Selecting Prey Type */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
            {/* Custom Input Mode */}
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
            ) : selectedCategory ? (
              <>
                <FlatList
                  data={[...selectedCategory.options, otherLabel]}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectOption(item)}
                      style={[
                        styles.option,
                        { borderBottomColor: fieldAccent },
                      ]}
                    >
                      <ThemedText type="default" style={{ color: textColor }}>
                        {item}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setSelectedCategory(null)}
                  style={styles.cancelButton}
                >
                  <ThemedText type="default" style={{ color: iconColor }}>
                    Back
                  </ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  placeholder="Search..."
                  placeholderTextColor={subtleColor}
                  style={[
                    styles.searchInput,
                    { color: textColor, borderColor: fieldAccent },
                  ]}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />

                {/* List of Categories */}
                <FlatList
                  data={[...filteredCategories, { category: otherLabel }]}
                  keyExtractor={(item, index) => item.category + index}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectCategory(item)}
                      style={[
                        styles.option,
                        { borderBottomColor: fieldAccent },
                      ]}
                    >
                      <ThemedText type="default" style={{ color: textColor }}>
                        {item.category}
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
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
            <ThemedText type="default" style={{ textAlign: "center" }}>
              You have {matchingFreezerItem?.quantity} of {selectedPrey} in your
              freezer. Would you like to use them?
            </ThemedText>
            <TouchableOpacity
              onPress={onFreezerConfirm}
              style={styles.submitButton}
            >
              <ThemedText type="default">Yes</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onFreezerDecline}
              style={styles.cancelButton}
            >
              <ThemedText type="default">No</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay for contrast
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    fontSize: SIZES.medium,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
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
