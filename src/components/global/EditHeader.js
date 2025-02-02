import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { SIZES } from "@/constants/Theme";

export default function EditHeader({ label, description }) {
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");

  return (
    <View style={[styles.container, { borderBottomColor: fieldColor }]}>
      {label && (
        <ThemedText type="subtitle" style={styles.label}>
          {label}
        </ThemedText>
      )}
      {description && (
        <ThemedText
          type="default"
          style={[styles.description, { color: iconColor }]}
        >
          {description}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderBottomWidth: 1,
    paddingBottom: SIZES.small,
  },
  label: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 4,
  },
});
