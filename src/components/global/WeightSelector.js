// WeightSelector.js
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { FONT, SIZES } from "@/constants/Theme";

export default function WeightSelector({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.1,
}) {
  const textColor = useThemeColor({}, "text");
  const bgColor = useThemeColor({}, "background");
  const fieldColor = useThemeColor({}, "field");
  const iconColor = useThemeColor({}, "icon");

  const increase = () => {
    if (value < max) {
      onChange(parseFloat((value + step).toFixed(2)));
    }
  };

  const decrease = () => {
    if (value > min) {
      onChange(parseFloat((value - step).toFixed(2)));
    }
  };

  const handleChangeText = (text) => {
    // Allow empty string so the user can clear it, then fallback to 0
    if (text === "") {
      onChange(0);
      return;
    }
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      // Clamp the value between min and max
      const clamped = Math.max(min, Math.min(max, parsed));
      onChange(clamped);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={decrease}
        style={[
          styles.button,
          { borderColor: "transparent", backgroundColor: fieldColor },
        ]}
      >
        <ThemedText type="default" style={{ color: iconColor }}>
          –
        </ThemedText>
      </TouchableOpacity>
      <TextInput
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: iconColor,
            backgroundColor: bgColor,
            fontSize: SIZES.medium,
            fontFamily: FONT.regular,
          },
        ]}
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={handleChangeText}
      />
      <TouchableOpacity
        onPress={increase}
        style={[
          styles.button,
          { borderColor: "transparent", backgroundColor: fieldColor },
        ]}
      >
        <ThemedText
          type="default"
          style={{ color: iconColor, backgroundColor: fieldColor }}
        >
          +
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 5,
    minWidth: 60,
    textAlign: "center",
  },
});
