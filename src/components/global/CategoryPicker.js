import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { FONT, SIZES } from "@/constants/Theme";

export default function CategoryPicker({
  label,
  selectedValue,
  onValueChange,
  items,
  compact = false,
}) {
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  // Provide a placeholder that is shorter in compact mode.
  const placeholder = {
    label: compact ? "Select..." : "Select an option...",
    value: null,
    color: iconColor,
  };

  // Define styles for normal mode.
  const normalPickerStyles = {
    inputIOS: {
      color: textColor,
      fontSize: SIZES.small,
      fontFamily: FONT.regular,
    },
    inputAndroid: {
      color: textColor,
      fontSize: SIZES.small,
      fontFamily: FONT.regular,
    },
    placeholder: {
      color: iconColor,
      fontFamily: FONT.regular,
    },
  };

  // Define styles for compact mode.
  const compactPickerStyles = {
    inputIOS: {
      color: textColor,
      fontSize: SIZES.medium,
      fontFamily: FONT.regular,
      textAlign: "center",
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    inputAndroid: {
      color: textColor,
      fontSize: SIZES.medium,
      fontFamily: FONT.regular,
      textAlign: "center",
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    placeholder: {
      color: iconColor,
      fontFamily: FONT.regular,
      textAlign: "center",
    },
  };

  const pickerStyles = compact ? compactPickerStyles : normalPickerStyles;

  return (
    <View style={compact ? styles.compactContainer : styles.container}>
      {/* Only show the label in non-compact mode */}
      {label && !compact && (
        <ThemedText type="default" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <View
        style={[
          compact ? styles.compactInputContainer : styles.inputContainer,
          { backgroundColor: bgColor, borderColor: iconColor },
        ]}
      >
        <RNPickerSelect
          placeholder={placeholder}
          value={selectedValue}
          onValueChange={onValueChange}
          // Ensure items is always an array to avoid errors.
          items={
            items ? items.map((item) => ({ label: item, value: item })) : []
          }
          style={pickerStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0, // standard spacing with AddPetScreen's field spacing
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  compactContainer: {
    // Fixed width for compact mode—adjust as needed.
    width: 50,
    alignItems: "center",
  },
  compactInputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 4,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
