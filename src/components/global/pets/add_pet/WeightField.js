// File: WeightField.js
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import CategoryPicker from "@/components/global/CategoryPicker";
import { WEIGHT_TYPES } from "@/constants/WeightTypes";
import { useThemeColor } from "@/hooks/useThemeColor";
import NumericPickerModal from "@/components/global/NumericPickerModal";

export default function WeightField({
  weight,
  setWeight,
  weightType,
  setWeightType,
  label = "Prey Weight",
  isEditing,
}) {
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      {/* Label Row */}
      <View style={styles.titleContainer}>
        <Ionicons
          style={styles.icon}
          name="scale"
          size={18}
          color={iconColor}
        />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          {label}
        </ThemedText>
      </View>

      {/* Non-Editable Display Mode */}
      {!isEditing ? (
        <View style={styles.displayRow}>
          <ThemedText
            type="default"
            style={[styles.answer, { color: textColor }]}
          >
            {weight ? `${weight} ${weightType}` : "-"}
          </ThemedText>
        </View>
      ) : (
        /* Editable Mode */
        <View style={styles.weightRow}>
          {/* Touchable Opacity for Weight Input */}
          <TouchableOpacity
            onPress={() => setPickerVisible(true)}
            style={[styles.weightInputWrapper, { borderColor: iconColor }]}
          >
            <ThemedText type="default">{weight ? `${weight}` : "-"}</ThemedText>
          </TouchableOpacity>

          {/* Category Picker for Weight Type */}
          <View style={styles.weightTypeContainer}>
            <CategoryPicker
              compact={true}
              selectedValue={weightType}
              onValueChange={setWeightType}
              items={WEIGHT_TYPES}
            />
          </View>
        </View>
      )}

      {/* Numeric Picker Modal */}
      {isEditing && (
        <NumericPickerModal
          visible={pickerVisible}
          title="Select Weight"
          value={weight}
          onValueChange={setWeight}
          onClose={() => setPickerVisible(false)}
          min={0}
          max={1000}
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
    alignSelf: "flex-start",
  },
  label: {
    marginLeft: 6, // Standardized spacing
  },
  icon: {
    marginRight: 6, // Standardized spacing
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 12,
  },
  displayRow: {
    paddingVertical: 10,
    paddingHorizontal: 0, // Removes additional padding
    alignItems: "flex-start", // Aligns text to the left
  },
  answer: {
    textAlign: "left", // Ensures left alignment
    paddingVertical: 16,
  },
  weightInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },
  weightTypeContainer: {
    marginLeft: 0,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});
