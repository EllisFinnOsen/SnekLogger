import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme";

const LogCard = ({ feedingDate, feedingTime, preyType }) => {
  const fieldColor = useThemeColor({}, "field");

  return (
    <ThemedView style={[styles.container, { backgroundColor: fieldColor }]}>
      <ThemedText type="subtitle">{feedingDate}</ThemedText>
      <View style={styles.detail}>
        <ThemedText type="default"> {preyType}</ThemedText>
        <ThemedText type="smDetail"> {feedingTime}</ThemedText>
      </View>
    </ThemedView>
  );
};

export default LogCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: SIZES.xSmall,
    width: "100%",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },

  detail: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
});
