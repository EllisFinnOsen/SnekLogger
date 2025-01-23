import { useGlobalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import useFetch from "@/hooks/useFetch";
import { Stack } from "expo-router";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";

const FeedingDetails = () => {
  const params = useGlobalSearchParams();
  const { id } = params; // feedingId
  const { data, isLoading, error } = useFetch(
    `SELECT * FROM feedings WHERE id=${id}`
  );

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error || !data || data.length === 0) {
    return <Text>No feeding record found</Text>;
  }

  const feeding = data[0];
  const dateObj = new Date(feeding.feedingDate);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: `${formattedDate}`,
        }}
      />
      <ThemedScrollView>
        <View style={styles.row}>
          <ThemedText type="subtitle">Date: </ThemedText>
          <ThemedText type="default">{formattedDate}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Time: </ThemedText>
          <ThemedText type="default">{formattedTime}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Prey: </ThemedText>
          <ThemedText type="default">{feeding.preyType}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="subtitle">Complete: </ThemedText>
          <ThemedText type="default">
            {feeding.complete ? "Yes" : "No"}
          </ThemedText>
        </View>
        <View style={styles.notes}>
          <ThemedText type="title">Notes: </ThemedText>
          <ThemedText type="default">
            {feeding.notes && (
              <ThemedText type="default">{feeding.notes}</ThemedText>
            )}
          </ThemedText>
        </View>
      </ThemedScrollView>
    </>
  );
};

export default FeedingDetails;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  notes: {
    flexDirection: "column",
    marginTop: 22,
    alignItems: "baseline",
    gap: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "black", // Ensures text color is visible against white background
  },
});
