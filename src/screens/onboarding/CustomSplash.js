// CustomSplash.js
import React, { useEffect } from "react";
import { View, StyleSheet, useColorScheme, Text } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function CustomSplash({ onFinish }) {
  const scheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  // Simulate a loading period (or wait for your assets/initial data to load)
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 1500); // adjust the delay as needed
    return () => clearTimeout(timeout);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        Welcome to VorTrack
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
