import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";

import { fetchFeedings, selectFeedings } from "@/store/feedingsSlice";
import LogCard from "../cards/log/LogCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { SIZES } from "@/constants/Theme";

const Upcoming = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    console.log("useEffect triggered");
    const query = `SELECT * 
      FROM feedings 
      WHERE complete = 0 
      AND (feedingDate <= DATE('now') OR feedingDate > DATE('now')) 
      ORDER BY 
        CASE WHEN feedingDate <= DATE('now') THEN 1 ELSE 0 END, 
        feedingDate;`;
    dispatch(fetchFeedings(query));
  }, [dispatch]);

  const feedings = useSelector(selectFeedings);
  console.log("Feedings from Redux after fetch:", feedings);

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Upcoming Feedings</ThemedText>
        <TouchableOpacity>
          <ThemedText type="link">Show all</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        {feedings.length === 0 ? (
          <ActivityIndicator size="large" color={textColor} />
        ) : (
          <View style={styles.displayCards}>
            {feedings.map((feeding) => (
              <LogCard
                key={feeding.id}
                feedingDate={feeding.feedingDate}
                feedingTime={feeding.feedingTime}
                preyType={feeding.preyType}
                initialComplete={feeding.complete}
                feedingId={feeding.id}
                petId={feeding.petId}
              />
            ))}
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Upcoming;

import { StyleSheet } from "react-native";
import { useAppDispatch } from "@/hooks/useAppDispatch";
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
