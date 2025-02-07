import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import { SIZES } from "@/constants/Theme";

export default function AddFreezerButton({ onPress }) {
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      onPress={onPress} // ✅ Now calls the function passed from FreezerScreen
      style={[
        styles.wrap,
        { backgroundColor: fieldColor, borderColor: fieldAccent },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Add to Freezer
          </ThemedText>
          <ThemedText type="smDetail" style={{ color: textColor }}>
            Tap to add new prey item
          </ThemedText>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="add-circle-outline" size={30} color={iconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: SIZES.xSmall,
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: SIZES.xxSmall,
    borderWidth: 2,
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textContainer: {
    flexDirection: "column",
  },
  iconContainer: {
    marginRight: 0,
  },
});
