// GroupPetList.jsx
import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PetList from "@/components/global/pets/PetList";
import { fetchPetsByGroupIdFromDb } from "@/database";

export default function GroupPetList({ group }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        const petsData = await fetchPetsByGroupIdFromDb(group.id);
        // Ensure petsData is an array (default to [] if undefined)
        setPets(petsData || []);
      } catch (error) {
        console.error(`Error fetching pets for group ${group.id}:`, error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, [group.id]);

  return (
    <ThemedView style={styles.groupContainer}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <PetList
          pets={pets}
          title={group.name}
          groupId={group.id}
          loading={loading}
          noPetsText={`No pets available in ${group.name}`}
          showAllLink={true}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    marginBottom: 8,
  },
});
