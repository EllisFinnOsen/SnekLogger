// CustomStatusBar.js
import React from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import useColorScheme from "@/hooks/useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function CustomStatusBar(props) {
  // Use your theming hook to grab the colors defined in your theme.
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  // Option 1: Decide on the bar style based on the system color scheme.
  // This works well if your theme's "background" color roughly follows system defaults.
  const colorScheme = useColorScheme();
  const barStyle = colorScheme === "dark" ? "light" : "dark";

  // Option 2 (Alternative):
  // If you want to decide the bar style based on the brightness of your textColor,
  // you might add logic to compute whether textColor is "light" or "dark."
  // For now, we'll use the system color scheme.

  return (
    <StatusBar
      style={barStyle} // "light" for dark mode, "dark" for light mode
      backgroundColor={Platform.OS === "android" ? backgroundColor : undefined}
      {...props}
    />
  );
}
