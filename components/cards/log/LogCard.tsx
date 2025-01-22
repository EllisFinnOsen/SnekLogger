import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";

const LogCard = () => {
  const fieldColor = useThemeColor({}, "field");

  return (
    <ThemedView style={[styles.container, { backgroundColor: fieldColor }]}>
      <ThemedText type="subtitle">12/7/2012</ThemedText>
      <ThemedText type="default"> - Rat Feeding</ThemedText>
    </ThemedView>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: SIZES.xSmall,
    width: "100%",
    alignItems: "center",
    gap: 8,
    padding: 16, // Add padding or other layout styles as needed
  },
});
