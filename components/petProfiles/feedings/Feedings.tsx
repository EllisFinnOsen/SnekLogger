import LogCard from "@/components/cards/log/LogCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useDispatch, useSelector } from "react-redux";
import {
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fetchAllFeedings } from "@/store/feedingsSlice";
import { RootState } from "@/store";
import { SIZES } from "@/constants/Theme";

const Feedings = ({ petId }) => {
  const dispatch = useDispatch();
  const db = useSQLiteContext();
  
  // Get feedings from Redux store
  const {
    list: feedings,
    status,
    error,
  } = useSelector((state: RootState) => state.feedings);

  // Re-fetch feedings when component mounts
  useEffect(() => {
    dispatch(fetchAllFeedings(db) as any);
  }, []);

  // Filter feedings for current pet
  const petFeedings = useMemo(() => {
    const filtered = feedings.filter(f => f.petId === Number(petId));
    console.log('Feedings: Filtered feedings for pet:', { 
      petId, 
      totalFeedings: feedings.length,
      filteredCount: filtered.length 
    });
    return filtered;
  }, [feedings, petId]);

  // Sort feedings
  const sortedFeedings = useMemo(() => {
    return [...petFeedings]
      .filter((f) => !f.complete)
      .concat(petFeedings.filter((f) => f.complete))
      .sort(
        (a, b) =>
          new Date(b.feedingDate).getTime() - new Date(a.feedingDate).getTime()
      );
  }, [petFeedings]);

  if (status === "loading") {
    return <ActivityIndicator size="large" />;
  }

  if (status === "failed") {
    return <Text>Something went wrong: {error}</Text>;
  }

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Feedings</ThemedText>
        <TouchableOpacity>
          <ThemedText type="link">Add Feeding</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        {sortedFeedings.length === 0 ? (
          <ThemedText type="default">No feedings found for this pet.</ThemedText>
        ) : (
          <View style={styles.displayCards}>
            {sortedFeedings.map((item) => (
              <LogCard
                key={item.id}
                feedingId={item.id}
                petId={item.petId}
                feedingDate={item.feedingDate}
                feedingTime={item.feedingTime}
                preyType={item.preyType}
                initialComplete={item.complete}
              />
            ))}
          </View>
        )}
      </ThemedView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardsContainer: {
    marginTop: SIZES.xSmall,
  },
  displayCards: {
    flexDirection: "column",
    marginTop: SIZES.xSmall,
    gap: 10,
  },
});
