import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import { SIZES } from "@/constants/Theme";

export default function AddLogCard({ petId }) {
  const navigation = useNavigation();

  // Retrieve theme colors
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const subtleColor = useThemeColor({}, "subtle");

  const handlePress = () => {
    navigation.navigate("AddFeedingScreen", petId ? { petId } : {});
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
        {/* Right Section: Text */}
        <View style={styles.textContainer}>
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            Add New Feeding Log
          </ThemedText>
          <ThemedText type="smDetail" style={{ color: subtleColor }}>
            {petId ? "For this pet" : "For any pet"}
          </ThemedText>
        </View>
        {/* Left Section: Placeholder Icon */}
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
    alignContent: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  iconContainer: {
    marginRight: 0,
  },
  textContainer: {
    flexDirection: "column",
  },
});
