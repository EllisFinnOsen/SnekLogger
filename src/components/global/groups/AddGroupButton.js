// AddGroupButton.js
import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import { SIZES } from "@/constants/Theme";

export default function AddGroupButton() {
  const navigation = useNavigation();
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");

  const handlePress = () => {
    // Adjust the route name and params as needed.
    navigation.navigate("AddGroupScreen");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.wrap,
        { backgroundColor: fieldColor, borderColor: fieldAccent },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Add New Group
          </ThemedText>
          <ThemedText type="smDetail" style={{ color: textColor }}>
            Tap to create a group
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
