import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FONT, SIZES } from "@/constants/Theme";

export default function NotesField({ notes, setNotes, isEditing }) {
  const iconColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({}, isEditing ? "icon" : "field");
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.fieldContainer}>
      {/* Icon & Label */}
      <View style={styles.titleContainer}>
        <Ionicons name="document-text-outline" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Notes
        </ThemedText>
      </View>

      {/* Text Input */}
      <View style={[styles.inputWrapper, { borderColor: borderColor }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: bgColor,
              color: textColor,
              fontFamily: FONT.regular,
              fontSize: SIZES.medium,
            },
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter feeding notes..."
          editable={isEditing}
          multiline={true}
        />
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
