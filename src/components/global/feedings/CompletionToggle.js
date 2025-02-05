import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function CompletionToggle({ isComplete, onToggle }) {
  const activeColor = useThemeColor({}, "active");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  return (
    <View style={styles.row}>
      {/* Left Icon + Text */}
      <View style={styles.titleRow}>
        <Ionicons
          style={styles.iconCheck}
          name={isComplete ? "checkmark-circle" : "ellipse-outline"}
          size={18}
          color={isComplete ? activeColor : iconColor}
        />
        <ThemedText type="default">
          {isComplete ? "Complete" : "Incomplete"}
        </ThemedText>
      </View>

      {/* Right Toggle Button */}
      <TouchableOpacity onPress={onToggle} style={styles.toggle}>
        <Ionicons
          name={isComplete ? "checkbox" : "square-outline"}
          size={24}
          color={isComplete ? activeColor : textColor}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCheck: {
    marginRight: 8,
  },
  toggle: {
    padding: 4,
  },
});
