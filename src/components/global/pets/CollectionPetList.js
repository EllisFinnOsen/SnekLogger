// CollectionPetList.jsx
import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import GroupPetList from "./GroupPetList";

export default function CollectionPetList({ groups }) {
  return (
    <ThemedView>
      {groups.length === 0 ? (
        <ThemedText></ThemedText>
      ) : (
        groups.map((group) => <GroupPetList key={group.id} group={group} />)
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Add any group-level styling here if needed
});
