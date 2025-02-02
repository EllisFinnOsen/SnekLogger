import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import WeightSelector from "@/components/global/WeightSelector";
import CategoryPicker from "@/components/global/CategoryPicker";
import { WEIGHT_TYPES } from "@/constants/WeightTypes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";

export default function WeightField({
  weight,
  setWeight,
  weightType,
  setWeightType,
}) {
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={styles.fieldContainer}>
      <ThemedText type="default" style={styles.label}>
        Weight
      </ThemedText>
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
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightTypeContainer: {
    marginLeft: 32,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
