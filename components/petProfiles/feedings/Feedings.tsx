import LogCard from "@/components/cards/log/LogCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";

const Feedings = ({ title }) => {
  return (
    <ThemedView>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedView style={styles.container}>
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
        <LogCard />
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
});
