import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PetList from "@/components/global/pets/PetList";
import { fetchGroups, fetchPetsByGroupId } from "@/redux/actions";
import { StyleSheet } from "react-native";

export default function CollectionPetList() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups || []);
  const groupPets = useSelector((state) => state.groupPets || {});

  useEffect(() => {
    console.log("Redux Groups:", groups);
  }, [groups]);

  useEffect(() => {
    console.log("Redux Group Pets:", JSON.stringify(groupPets, null, 2));
  }, [groupPets]);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach((group) => {
        dispatch(fetchPetsByGroupId(group.id));
      });
    }
  }, [dispatch, JSON.stringify(groups)]);

  return (
    <ThemedView>
      {groups.length > 0 ? (
        groups.map((group) => {
          const pets = groupPets[group.id] || [];
          return (
            <ThemedView key={group.id} style={styles.groupContainer}>
              <PetList
                pets={pets}
                title={group.name}
                showAllLink={true}
                groupId={group.id}
                noPetsText={`No pets available in ${group.name}`}
              />
            </ThemedView>
          );
        })
      ) : (
        <ThemedText>No groups available</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 24,
  },
});
