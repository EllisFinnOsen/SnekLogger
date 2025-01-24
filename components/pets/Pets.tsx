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
import { useDispatch, useSelector } from "react-redux";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { RootState } from "@/store"; // If you have a typed RootState

import { FONT, Colors, SIZES } from "@/constants/Theme";

const Pets = () => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");

  const dispatch = useDispatch();
  const {
    list: pets,
    status,
    error,
  } = useSelector((state: RootState) => state.pets);

  const db = useSQLiteContext();

  useEffect(() => {
    // On mount, fetch from DB and store in Redux
    dispatch(fetchPets(db) as any);
    // ^ if using TypeScript, you might have to cast dispatch(...) as any or set up typed dispatch
  }, []);

  if (status === "loading") {
    return <ActivityIndicator size="large" color={textColor} />;
  }

  if (status === "failed") {
    return <Text>Something went wrong: {error}</Text>;
  }
  return (
    <ThemedView>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Your Pets</ThemedText>
        <TouchableOpacity onPress={() => router.push(`/collection`)}>
          <ThemedText type="link">Show all</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.cardsContainer}>
        <FlatList
          data={pets}
          renderItem={({ item }) => <SmallCard pet={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ columnGap: SIZES.medium }}
          horizontal
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Pets;

import { StyleSheet } from "react-native";
import { fetchPets } from "@/store/petsSlice";
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
