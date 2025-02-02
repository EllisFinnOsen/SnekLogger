import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

export default function CustomButton({ title, onPress, style, textType }) {
  const textColor = useThemeColor({}, "text");
  const activeColor = useThemeColor({}, "active");
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <ThemedText
        type={textType}
        style={[styles.buttonText, { color: textColor }]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: "blue", // default fallback color
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
  },
});
