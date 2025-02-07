import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PreyDisplayCard({ preyType, selectedFreezerId }) {
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={styles.valueContainer}>
      <ThemedText type="default">{preyType || " - "}</ThemedText>
      {selectedFreezerId && (
        <Ionicons
          name="snow-outline"
          size={16}
          color={iconColor}
          style={styles.icon}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: { marginLeft: 6 },
});
