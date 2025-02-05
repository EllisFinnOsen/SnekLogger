import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FONT, SIZES } from "@/constants/Theme";
import { ThemedText } from "./global/ThemedText";

export default function UserNameField({
  name,
  setName,
  required = false,
  errorMessage = "",
}) {
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  const iconColor = useThemeColor({}, "icon");
  const subtleColor = useThemeColor({}, "subtleText");

  // Determine border color based on error presence
  const borderColor = errorMessage ? errorColor : iconColor;

  return (
    <View style={styles.container}>
      <ThemedText type="default" style={styles.label}>
        Name{" "}
        {required && (
          <ThemedText type="default" style={styles.required}>
            *
          </ThemedText>
        )}
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: borderColor,
            fontFamily: FONT.regular,
            color: textColor,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor={subtleColor}
      />
      {errorMessage ? (
        <Text style={[styles.errorText, { color: errorColor }]}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 5,
    fontSize: SIZES.medium,
  },
  errorText: {
    marginTop: 4,
  },
});
