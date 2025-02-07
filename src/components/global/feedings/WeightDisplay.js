import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function WeightDisplay({
  weight,
  weightType,
  label = "Prey Weight",
}) {
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={styles.fieldContainer}>
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

      <View style={styles.valueContainer}>
        <ThemedText type="default">
          {weight ? `${weight} ${weightType}` : "Not Set"}
        </ThemedText>
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
    marginLeft: 6,
  },
  icon: {
    marginRight: 6,
  },
  valueContainer: {
    borderRadius: 5,
    paddingVertical: 10,
  },
});
