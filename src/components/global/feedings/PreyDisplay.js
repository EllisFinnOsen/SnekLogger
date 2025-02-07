import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PreyDisplay({ preyType, selectedFreezerId }) {
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Prey Type
        </ThemedText>
      </View>

      <View style={styles.valueContainer}>
        <ThemedText type="default">{preyType || " - "}</ThemedText>
        {selectedFreezerId && (
          <Ionicons
            name="snow-outline"
            size={16}
            color={iconColor}
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: { marginVertical: 8 },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 6 },
  icon: { marginRight: 6 },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 6,
  },
});
