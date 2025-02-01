import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HeaderSection({ onCancel }) {
  const textColor = useThemeColor({}, "text");
  return (
    <View style={styles.customHeader}>
      <TouchableOpacity onPress={onCancel}>
        <Ionicons name="arrow-back" size={24} color={textColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel}>
        <Text style={[styles.cancelText, { color: textColor }]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
  },
});
