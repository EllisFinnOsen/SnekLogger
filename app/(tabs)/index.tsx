import { Image, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";

import { HelloWave } from "@/components/HelloWave";
import ThemedScrollView from "@/components/ThemedScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Search from "@/components/search/Search";
import Pets from "@/components/pets/Pets";
import Upcoming from "@/components/upcoming/Upcoming";

export default function HomeScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <ThemedScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello, Ellis</ThemedText>
        <HelloWave />
      </ThemedView>
      <Search
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleClick={() => {
          if (searchTerm) {
            router.push(`/explore`);
          }
        }}
      />
      <ThemedView style={styles.stepContainer}>
        <Pets />
        <Upcoming />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Something Else</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gradient: {
    // Match the size of the text
    padding: 10,
    borderRadius: 5,
  },
  stepContainer: {
    gap: 18,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "transparent", // Makes the gradient visible
    backgroundColor: "transparent", // Ensures no background color interferes
  },
});
