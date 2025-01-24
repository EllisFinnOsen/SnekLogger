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
import { useThemeColor } from "@/src/hooks/useThemeColor";
import useFetch from "@/src/hooks/useFetch";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { FONT, Colors, SIZES } from "@/src/constants/Theme";

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
              // Formatting the date into mm/dd/yy

              // Pass the formatted date and time into LogCard
              return (
                <LogCard
                  key={item.id}
                  feedingDate={item.feedingDate}
                  feedingTime={item.feedingTime}
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
