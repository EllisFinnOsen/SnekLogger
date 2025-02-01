import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import { fetchPetsByGroupId } from "@/redux/actions";

export default function GroupScreen({ route, navigation }) {
  // Get the groupId from the route parameters
  const { groupId } = route.params;
  const dispatch = useDispatch();

  // When the screen mounts, fetch the pets for this group.
  useEffect(() => {
    if (groupId) {
      dispatch(fetchPetsByGroupId(groupId));
    }
  }, [dispatch, groupId]);

  // Select the pets from the Redux store for this group.
  const pets = useSelector((state) => state.groupPets[groupId]) || [];

  // Select the group details from the Redux store.
  const group = useSelector((state) =>
    state.groups.find((g) => g.id === groupId)
  );
  const groupName = group ? group.name : `Group ${groupId}`;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.headerText}>
        {groupName}
      </ThemedText>

      {pets.length > 0 ? (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <PrimaryPetCard pet={item} />
            </View>
          )}
        />
      ) : (
        <ThemedText type="default">No pets available in this group</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    // This ensures that the items expand evenly in a 2-column grid.
    maxWidth: "48%",
  },
});
