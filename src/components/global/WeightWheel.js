// WeightWheel.js
import React, { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function WeightWheel({
  value,
  onValueChange,
  min = 0,
  max = 10000,
  step = 0.1,
}) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  // Local state for modal visibility and temporary value.
  const [modalVisible, setModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  // Create the list of weight options.
  // Note: If max - min is large with a small step, this list could be very long.
  // You might cache this or restrict the range in a real-world app.
  const options = [];
  for (let v = min; v <= max; v += step) {
    options.push(parseFloat(v.toFixed(1)));
  }

  // When the modal is opened, ensure tempValue starts at the current value.
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.displayButton,
          { backgroundColor: bgColor, borderColor: iconColor },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="default" style={{ color: textColor }}>
          {value.toFixed(1)}
        </ThemedText>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <Picker
              selectedValue={tempValue}
              onValueChange={(itemValue) => setTempValue(itemValue)}
              style={{ color: textColor }}
              itemStyle={{ color: textColor }}
            >
              {options.map((num, index) => (
                <Picker.Item key={index} label={num.toFixed(1)} value={num} />
              ))}
            </Picker>
            <TouchableOpacity
              style={[styles.confirmButton, { borderColor: iconColor }]}
              onPress={() => {
                setModalVisible(false);
                onValueChange(tempValue);
              }}
            >
              <ThemedText type="default" style={{ color: iconColor }}>
                Confirm
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  displayButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    padding: 16,
  },
  confirmButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
});
