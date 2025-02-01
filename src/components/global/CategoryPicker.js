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
}) {
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const placeholder = {
    label: "Select an option...",
    value: null,
    color: iconColor,
  };

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText type="default" style={styles.label}>
          {label}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: bgColor,
            borderColor: iconColor,
            fontFamily: FONT.regular,
          },
        ]}
      >
        <RNPickerSelect
          placeholder={placeholder}
          value={selectedValue}
          onValueChange={onValueChange}
          items={items.map((item) => ({ label: item, value: item }))}
          style={{
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
            placeholder: { color: iconColor, fontFamily: FONT.regular },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0, // Standardizing with AddPetScreen's field spacing
  },
  label: {
    marginBottom: 4, // Same as in AddPetScreen
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
});
