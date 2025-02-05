import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import WeightSelector from "@/components/global/WeightSelector";
import CategoryPicker from "@/components/global/CategoryPicker";
import { WEIGHT_TYPES } from "@/constants/WeightTypes";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function WeightField({
  weight,
  setWeight,
  weightType,
  setWeightType,
  label = "Prey Weight",
  isEditing,
}) {
  const iconColor = useThemeColor({}, "icon");
  const cancelColor = useThemeColor({}, "field");

  return (
    <View style={styles.fieldContainer}>
      {/* Title & Icon */}
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

      {/* Input Wrapper (Border & Layout) */}
      <View
        style={[
          styles.inputWrapper,
          { borderColor: isEditing ? "transparent" : "transparent" },
        ]}
      >
        {isEditing ? (
          <View style={styles.weightRow}>
            <WeightSelector
              value={weight}
              onChange={setWeight}
              min={0}
              max={100000}
              step={1}
            />
            <View style={styles.weightTypeContainer}>
              <CategoryPicker
                compact={true}
                selectedValue={weightType}
                onValueChange={setWeightType}
                items={WEIGHT_TYPES}
              />
            </View>
          </View>
        ) : (
          <ThemedText style={styles.answer} type="default">
            {weight} {weightType}
          </ThemedText>
        )}
      </View>
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
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8, // Matches PreyTypeField padding
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  weightTypeContainer: {
    marginLeft: 0,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  answer: {
    paddingVertical: 12,
    borderRadius: 5,
  },
});
