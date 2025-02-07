// @ts-ignore
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import { SIZES } from "@/constants/Theme";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { useNavigation } from "@react-navigation/native";

export default function HorizontalPetsList() {
  const pets = useSelector((state) => state.pets.pets || []);
  const navigation = useNavigation();

  if (pets.length === 0) {
    return <Text>No pets available</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Your Pets</ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate("GroupScreen")}>
          <ThemedText type="link">Show all</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.cardsContainer}>
        <ScrollView horizontal style={styles.petList}>
          {pets.map((pet) => (
            <PrimaryPetCard key={pet.id} pet={pet} /> // Use the new component
          ))}
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SIZES.large,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petList: {
    flexDirection: "row",
    gap: 16,
  },
  cardsContainer: {
    marginTop: SIZES.xSmall,
  },
});
