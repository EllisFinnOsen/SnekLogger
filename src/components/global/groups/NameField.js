import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FONT, SIZES } from "@/constants/Theme";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

export default function NameField({
  value,
  setValue,
  required = false,
  errorMessage = "",
  placeholder = "Enter name",
  label = "Name",
}) {
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  const subtleColor = useThemeColor({}, "subtleText");

  // Determine border color based on error presence
  const borderColor = errorMessage ? errorColor : iconColor;

  return (
    <View style={styles.fieldContainer}>
      {/* Icon & Label */}
      <View style={styles.titleContainer}>
        <Ionicons name="document-text-outline" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Notes
        </ThemedText>
      </View>

      <View style={[styles.inputWrapper, { borderColor: borderColor }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: bgColor,
              color: textColor,
              fontFamily: FONT.regular,
              fontSize: SIZES.medium,
            },
          ]}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={subtleColor}
        />
        {errorMessage ? (
          <Text style={[styles.errorText, { color: errorColor }]}>
            {errorMessage}
          </Text>
        ) : null}
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
    marginLeft: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  textInput: {
    minHeight: 80, // Medium-sized text box
    textAlignVertical: "top", // Ensures text starts at the top
  },
});
