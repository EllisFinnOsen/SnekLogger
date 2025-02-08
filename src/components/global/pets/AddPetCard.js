// AddPetCard.jsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function AddPetCard() {
  const iconColor = useThemeColor({}, "icon");
  const subtleColor = useThemeColor({}, "subtleText");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const textColor = useThemeColor({}, "text");
  //console.log("AddPetCard rendered");

  return (
    <View
      testID="add-pet-card"
      style={[
        styles.card,
        { borderColor: fieldAccent, backgroundColor: fieldColor },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          testID="add-pet-icon"
          name="add-circle-outline"
          size={48}
          color={iconColor}
        />
      </View>
      <ThemedText style={{ color: subtleColor }} type="default">
        Add New Pet
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    width: 160,
    height: 100,
  },
  iconContainer: {
    marginBottom: 8,
  },
});
