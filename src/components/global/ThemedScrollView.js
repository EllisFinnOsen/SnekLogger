// ThemedScrollView.jsx
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "./ThemedView";
import { useBottomTabOverflow } from "./TabBarBackground";

export default function ThemedScrollView({
  children,
  contentContainerStyle,
  style,
  testID = "simple-scrollview", // default testID
  ...otherProps
}) {
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={[styles.container, style]}>
      <ScrollView
        testID="simple-scrollview" // default testID
        scrollIndicatorInsets={{ bottom }} // add this line
        contentContainerStyle={[
          styles.content,
          contentContainerStyle,
          { paddingBottom: bottom },
        ]}
        {...otherProps}
      >
        {children}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    // Default styles for the inner container:
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 64,
    // Remove any hardcoded values you don't want by default.
  },
});
