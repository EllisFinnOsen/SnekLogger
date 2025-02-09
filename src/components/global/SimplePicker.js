import React, { useState } from "react";
import {
  Modal,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function SimplePicker({
  label,
  options = [],
  selectedValue,
  onValueChange,
  placeholder = "Select an option...",
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const fieldAccent = useThemeColor({}, "fieldAccent");

  const [modalVisible, setModalVisible] = useState(false);

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
            style={{ color: selectedValue ? textColor : fieldAccent }}
          >
            {selectedValue || placeholder}
          </ThemedText>
          <Ionicons name="chevron-down" size={20} color={iconColor} />
        </View>
      </TouchableOpacity>

      {/* Modal for selecting an option */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                  style={[styles.option, { borderBottomColor: fieldAccent }]}
                >
                  <Text style={{ color: textColor }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <ThemedText type="default" style={{ color: iconColor }}>
                Cancel
              </ThemedText>
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
  picker: { borderWidth: 1, borderRadius: 5, padding: 10 },
  pickerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 250,
    padding: 16,
    borderRadius: 10,
  },
  option: { padding: 12, borderBottomWidth: 1 },
  cancelButton: { marginTop: 16, alignSelf: "center" },
});
