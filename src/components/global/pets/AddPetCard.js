import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function AddPetCard() {
  const navigation = useNavigation();
  const iconColor = useThemeColor({}, "icon");
  const subtleColor = useThemeColor({}, "subtleText");
  const fieldColor = useThemeColor({}, "field");

  const handlePress = () => {
    navigation.navigate("AddPetScreen");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.card, { borderColor: iconColor }]}
    >
      <ThemedView style={styles.iconContainer}>
        <Ionicons name="add-circle-outline" size={48} color={iconColor} />
      </ThemedView>
      <ThemedText style={{ color: subtleColor }} type="default">
        Add New Pet
      </ThemedText>
    </TouchableOpacity>
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
