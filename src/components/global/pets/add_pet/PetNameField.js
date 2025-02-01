import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";

export default function PetNameField({ name, setName }) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={styles.fieldContainer}>
      <ThemedText type="default" style={styles.label}>
        Name
      </ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
            fontSize: SIZES.medium,
          },
        ]}
        placeholder="Enter pet's name"
        placeholderTextColor={iconColor}
        value={name}
        onChangeText={setName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: SIZES.small,
    borderRadius: 5,
    paddingVertical: SIZES.medium,
  },
});
