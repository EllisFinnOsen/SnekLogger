import LogCard from "@/components/cards/log/LogCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { useDispatch, useSelector } from "react-redux";
import {
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { fetchAllFeedings } from "@/store/feedingsSlice";
import { RootState } from "@/store";

const Feedings = () => {
  const dispatch = useDispatch();
  const db = useSQLiteContext();
  const {
    list: feedings,
    status,
    error,
  } = useSelector((state: RootState) => state.feedings);

  useEffect(() => {
    dispatch(fetchAllFeedings(db) as any);
  }, []);

  // Example sorting: show "incomplete" first, then by recent date
  const sortedFeedings = useMemo(() => {
    return [...feedings]
      .filter((f) => !f.complete) // Incomplete feedings first
      .concat(feedings.filter((f) => f.complete)) // Then completed
      .sort(
        (a, b) =>
          new Date(b.feedingDate).getTime() - new Date(a.feedingDate).getTime()
      );
  }, [feedings]);

  if (status === "loading") {
    return <ActivityIndicator size="large" />;
  }

  if (status === "failed") {
    return <Text>Something went wrong: {error}</Text>;
  }

  return (
    <ThemedView>
      <ThemedView>
        <ThemedText type="subtitle">Feedings</ThemedText>
        <TouchableOpacity
          onPress={() => {
            /* Add navigation or action */
          }}
        >
          <ThemedText type="link">Add Feeding</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={sortedFeedings}
        renderItem={({ item }) => (
          <LogCard
            feedingId={item.id}
            petId={item.petId}
            feedingDate={item.feedingDate}
            feedingTime={item.feedingTime}
            preyType={item.preyType}
            initialComplete={item.complete}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No feedings found.</Text>}
      />
    </ThemedView>
  );
};

export default Feedings;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
});
