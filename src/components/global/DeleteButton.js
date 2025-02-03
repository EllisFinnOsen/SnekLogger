import React from "react";
import { TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";

export default function DeleteButton({
  onPress,
  title = "Delete",
  confirmTitle = "Confirm Delete",
  confirmMessage = "Are you sure you want to delete this item?",
  style,
  textType = "default",
}) {
  const dangerColor = useThemeColor({}, "error");

  const handlePress = () => {
    Alert.alert(confirmTitle, confirmMessage, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: onPress, style: "destructive" },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, { backgroundColor: dangerColor }, style]}
    >
      <ThemedText type={textType} style={styles.text}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 16,
  },
  text: {
    color: "#fff",
  },
});
