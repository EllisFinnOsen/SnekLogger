// GroupPetList.js
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectGroupPets } from "@/redux/selectors/selectors";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "@/components/global/ThemedView";
import PetList from "@/components/global/pets/PetList";
import { fetchPetsByGroupId } from "@/redux/actions/groupActions";

export default function GroupPetList({ group }) {
  const dispatch = useDispatch();
  // Create a memoized selector instance for this group:
  const selectGroupPets = useMemo(makeSelectGroupPets, []);
  const groupPets = useSelector((state) => selectGroupPets(state, group.id));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(fetchPetsByGroupId(group.id));
      } catch (error) {
        // handle error if needed
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
