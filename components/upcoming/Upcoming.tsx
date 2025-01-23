import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  View,
} from "react-native";

import SmallCard from "../cards/small/SmallCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import useFetch from "@/hooks/useFetch";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { FONT, Colors, SIZES } from "@/constants/Theme";

const Upcoming = () => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const { data, isLoading, error } = useFetch(
    `SELECT * 
FROM feedings 
WHERE complete = 0 
AND (feedingDate <= DATE('now') OR feedingDate > DATE('now')) 
ORDER BY 
    CASE WHEN feedingDate <= DATE('now') THEN 1 ELSE 0 END, 
    feedingDate;`
  );

  const [selectedPet, setSelectedPet] = useState();

  const handleCardPress = () => {};

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Upcoming Feedings</ThemedText>
        <TouchableOpacity>
          <ThemedText type="link">Show all</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={textColor} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          <View style={styles.displayCards}>
            {data.map((item) => {
              const dateObj = new Date(item.feedingDate);
              const formattedDate = new Intl.DateTimeFormat("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              }).format(dateObj);

              const formattedTime = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(dateObj);

              return (
                <LogCard
                  key={item.id}
                  feedingDate={formattedDate}
                  feedingTime={formattedTime}
                  preyType={item.preyType}
                  initialComplete={item.complete}
                  feedingId={item.id}
                  petId={item.petId}
                />
              );
            })}
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Upcoming;

import { StyleSheet } from "react-native";
import LogCard from "../cards/log/LogCard";
const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
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
