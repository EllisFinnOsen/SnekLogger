import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import SmallCard from "../cards/small/SmallCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import useFetch from "@/hooks/useFetch";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

import { FONT, Colors, SIZES } from "@/constants/Theme";

const Pets = () => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const { data, isLoading, error } = useFetch("SELECT * FROM pets");

  const [selectedPet, setSelectedPet] = useState();

  const handleCardPress = () => {};

  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Your Pets</ThemedText>
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
          <FlatList
            data={data}
            renderItem={({ item }) => <SmallCard pet={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
          />
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Pets;

import { StyleSheet } from "react-native";
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
});
