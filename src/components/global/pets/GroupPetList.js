// GroupPetList.js
import React, { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import PetList from "@/components/global/pets/PetList";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetsByGroupId } from "@/redux/actions"; // This action should update state.groups.groupPets

export default function GroupPetList({ group }) {
  const dispatch = useDispatch();

  // Select the pet list for this group from Redux.
  const groupPets = useSelector(
    (state) => state.groups.groupPets[group.id] || []
  );

  // Use local loading state if needed.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Dispatch an action that fetches pets for the group and updates Redux state.
        await dispatch(fetchPetsByGroupId(group.id));
      } catch (error) {
        //console.error(`Error fetching pets for group ${group.id}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch, group.id]);

  return (
    <ThemedView style={styles.groupContainer}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <PetList
          pets={groupPets}
          title={group.name}
          groupId={group.id}
          loading={loading}
          noPetsText={`No pets available in ${group.name}`}
          showAllLink={true}
          showAllText="View group"
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 24,
  },
});
