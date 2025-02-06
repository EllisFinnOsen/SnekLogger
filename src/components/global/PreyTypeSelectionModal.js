// File: PreyTypeSelectionModal.js
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
import { Ionicons } from "@expo/vector-icons";

export default function PreyTypeSelectionModal({
  visible,
  onClose,
  options,
  onSelect,
  otherLabel = "Other (Enter custom option)",
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const subtleColor = useThemeColor({}, "subtleText");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState("");

  // Filter categories based on search
  const filteredCategories = options.filter(({ category }) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomSubmit = () => {
    if (customText.trim() !== "") {
      onSelect(customText);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
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
                  { color: textColor, borderColor: fieldAccent },
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
                data={[...selectedCategory.options, otherLabel, "Back"]}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (item === "Back") {
                        setSelectedCategory(null);
                      } else if (item === otherLabel) {
                        setCustomMode(true);
                      } else {
                        onSelect(item);
                        onClose();
                      }
                    }}
                    style={[styles.option, { borderBottomColor: fieldAccent }]}
                  >
                    <ThemedText type="default" style={{ color: textColor }}>
                      {item}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <>
              {/* Search Input */}
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
                    onPress={() => {
                      if (item.category === otherLabel) {
                        setCustomMode(true);
                      } else if (item.options) {
                        setSelectedCategory(item);
                      } else {
                        onSelect(item.category);
                        onClose();
                      }
                    }}
                    style={[styles.option, { borderBottomColor: fieldAccent }]}
                  >
                    <ThemedText type="default" style={{ color: textColor }}>
                      {item.category}
                    </ThemedText>
                    {item.options && (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={iconColor}
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* Cancel Button */}
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <ThemedText type="default" style={{ color: iconColor }}>
              Cancel
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  submitButton: { marginLeft: 8, padding: 10 },
});
