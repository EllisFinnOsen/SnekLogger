import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
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
  errorMessage,
}) {
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
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

      {/* Editable Mode */}
      <View style={styles.weightRow}>
        <TouchableOpacity
          onPress={() => setPickerVisible(true)}
          style={[
            styles.weightInputWrapper,
            { borderColor: errorMessage ? errorColor : iconColor },
          ]}
        >
          <ThemedText type="default">{weight ? `${weight}` : "-"}</ThemedText>
        </TouchableOpacity>

        <View style={styles.weightTypeContainer}>
          <CategoryPicker
            compact={true}
            selectedValue={weightType}
            onValueChange={setWeightType}
            items={WEIGHT_TYPES}
          />
        </View>
      </View>

      {errorMessage ? (
        <Text style={[styles.errorText, { color: errorColor }]}>
          {errorMessage}
        </Text>
      ) : null}

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
  },
  label: {
    marginLeft: 6,
  },
  icon: {
    marginRight: 6,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  weightInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  weightTypeContainer: {
    marginLeft: 0,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
