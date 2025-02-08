// PetDataScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import EditHeader from "../../EditHeader";

export default function PetDataScreen({ pet }) {
  const textColor = useThemeColor({}, "text");

  return (
    <>
      <View style={{ height: 24 }}></View>
      <EditHeader
        label="Data"
        description="below is the weight and feeding data for this pet"
      />
      <View style={styles.container}>
        <ThemedText type="default" style={{ color: textColor }}>
          Here is some data for {pet.name}:
        </ThemedText>
        {/* Render additional data as needed */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});
