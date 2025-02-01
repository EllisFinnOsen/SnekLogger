import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function CategoryPicker({
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
    <View
      style={[
        styles.inputContainer,
        { backgroundColor: bgColor, borderColor: iconColor },
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
            padding: 12,
          },
          inputAndroid: {
            color: textColor,
            padding: 8,
          },
          placeholder: {
            color: iconColor,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
});
