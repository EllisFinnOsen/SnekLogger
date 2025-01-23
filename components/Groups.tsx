import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import SmallCard from "./cards/small/SmallCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import useFetch from "@/hooks/useFetch";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

import { FONT, Colors, SIZES } from "@/constants/Theme";

const Groups = () => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");

  // Fetch groups and their pets
  const {
    data: groups,
    isLoading,
    error,
  } = useFetch(`
    SELECT g.id AS groupId, g.name AS groupName, p.*
    FROM groups g
    LEFT JOIN group_pets gp ON g.id = gp.groupId
    LEFT JOIN pets p ON gp.petId = p.id
    ORDER BY g.id
  `);

  const groupedData = groups
    ? groups.reduce((acc, curr) => {
        const { groupId, groupName, ...pet } = curr;
        if (!acc[groupId]) {
          acc[groupId] = { groupName, pets: [] };
        }
        acc[groupId].pets.push(pet);
        return acc;
      }, {})
    : {};

  return (
    <ThemedView>
      {isLoading ? (
        <ActivityIndicator size="large" color={textColor} />
      ) : error ? (
        <Text>Something went wrong</Text>
      ) : (
        Object.entries(groupedData).map(([groupId, { groupName, pets }]) => (
          <ThemedView key={groupId} style={styles.container}>
            <ThemedView style={styles.header}>
              <ThemedText type="subtitle">{groupName}</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  router.push(`/group/${groupId}`);
                }}
              >
                <ThemedText type="link">View Group</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.cardsContainer}>
              {pets.length === 0 ? (
                <Text>No pets in this group</Text>
              ) : (
                <FlatList
                  data={pets.concat({ isAddButton: true })} // Add a "special" item at the end
                  renderItem={({ item, index }) =>
                    item.isAddButton ? (
                      <AddToGroupSmallCard
                        onPress={
                          () => console.log(`Add pet to ${groupName}`) // Use groupName instead
                        }
                      />
                    ) : (
                      <SmallCard pet={item} />
                    )
                  }
                  keyExtractor={(item, index) =>
                    item.isAddButton
                      ? `add-button-${groupName}-${index}` // Use groupName instead
                      : item.id.toString()
                  }
                  contentContainerStyle={{ columnGap: SIZES.medium }}
                  horizontal
                />
              )}
            </ThemedView>
          </ThemedView>
        ))
      )}
    </ThemedView>
  );
};

export default Groups;

import { StyleSheet } from "react-native";
import AddToGroupSmallCard from "./cards/small/AddToGroupSmallCard";
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
