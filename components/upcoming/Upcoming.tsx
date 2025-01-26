import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useDispatch, useSelector } from "react-redux";
import { useSQLiteContext } from "expo-sqlite";
import { RootState } from "@/store";
import { fetchAllFeedings } from "@/store/feedingsSlice";
import LogCard from "../cards/log/LogCard";
import { SIZES } from "@/constants/Theme";
import {StyleSheet} from "react-native";

const Upcoming = () => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
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

  // Filter and sort feedings
  const upcomingFeedings = feedings
    .filter(feeding => !feeding.complete)
    .sort((a, b) => {
      const aDate = new Date(a.feedingDate);
      const bDate = new Date(b.feedingDate);
      const now = new Date();
      
      // Sort overdue first, then by date
      if (aDate <= now && bDate > now) return -1;
      if (bDate <= now && aDate > now) return 1;
      return aDate.getTime() - bDate.getTime();
    });

  if (status === "loading") {
    return <ActivityIndicator size="large" color={textColor} />;
  }

  if (status === "failed") {
    return <Text>Something went wrong: {error}</Text>;
  }

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Upcoming Feedings</ThemedText>
        <TouchableOpacity>
          <ThemedText type="link">Show all</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        <View style={styles.displayCards}>
          {upcomingFeedings.map((item) => (
            <LogCard
              key={item.id}
              feedingDate={item.feedingDate}
              feedingTime={item.feedingTime}
              preyType={item.preyType}
              initialComplete={item.complete}
              feedingId={item.id}
              petId={item.petId}
            />
          ))}
        </View>
      </ThemedView>
    </ThemedView>
  );
};

export default Upcoming;

const styles = StyleSheet.create({
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
