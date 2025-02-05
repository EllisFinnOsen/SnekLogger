import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import NumericPickerModal from "@/components/global/NumericPickerModal";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function QuantityField({
  quantity,
  setQuantity,
  isEditing,
  errorMessage,
}) {
  const [pickerVisible, setPickerVisible] = useState(false);
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons
          style={styles.icon}
          name="calculator"
          size={18}
          color={iconColor}
        />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Quantity
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={() => setPickerVisible(true)}
        style={[
          styles.inputWrapper,
          { borderColor: errorMessage ? errorColor : iconColor },
        ]}
      >
        <ThemedText type="default">{quantity || "Select"}</ThemedText>
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={[styles.errorText, { color: errorColor }]}>
          {errorMessage}
        </Text>
      ) : null}

      {/* Numeric Picker Modal */}
      {isEditing && (
        <NumericPickerModal
          visible={pickerVisible}
          title="Select Quantity"
          value={quantity}
          onValueChange={setQuantity}
          onClose={() => setPickerVisible(false)}
          min={1}
          max={100}
          step={1}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    marginLeft: 6,
  },
  icon: {
    marginRight: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
