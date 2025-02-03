// GroupScreen.jsx
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import AddPetCard from "@/components/global/pets/AddPetCard";
import AddPetPickerModal from "@/components/global/pets/add_pet/AddPetPickerModal";
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
  // (Make sure your reducer stores group pets in state.groupPets)
  const pets = useSelector((state) => state.groupPets[groupId]) || [];

  // Select the group details from the Redux store.
  // (Assuming your groups are stored in state.groups.groups)
  const group = useSelector((state) =>
    state.groups.groups.find((g) => g.id === groupId)
  );
  const groupName = group ? group.name : `Group ${groupId}`;

  // Local state to control the modal for adding an existing pet
  const [pickerVisible, setPickerVisible] = useState(false);

  // Append a dummy "add" item to represent the add card.
  // Make sure that the dummy item has a unique id that won't conflict with real pet IDs.
  const dataWithFooter = [...pets, { id: "add-pet", type: "add" }];

  // When the dummy add card is pressed, show the modal.
  const handleAddCardPress = () => {
    //console.log("handleAddCardPress triggered");
    // Since we're in a group context, show the picker modal.
    setPickerVisible(true);
  };

  // Render function for FlatList.
  const renderItem = ({ item }) => {
    if (item.type === "add") {
      return (
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={handleAddCardPress}>
            <AddPetCard />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.cardContainer}>
        <PrimaryPetCard pet={item} />
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.headerText}>
        {groupName}
      </ThemedText>

      {pets.length > 0 ? (
        <FlatList
          data={dataWithFooter}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      ) : (
        <ThemedText type="default">No pets available in this group</ThemedText>
      )}

      {pickerVisible && (
        <AddPetPickerModal
          visible={pickerVisible}
          groupId={groupId}
          onSelectOption={(option, selectedId) => {
            //console.log("Modal callback:", option, selectedId);
            if (option === "new") {
              // Navigate to AddPetScreen with groupId.
              navigation.navigate("AddPetScreen", { groupId });
            }
            // If needed, you could also handle the "existing" case here.
          }}
          onClose={() => {
            //console.log("Picker closed without selection.");
            setPickerVisible(false);
          }}
        />
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
    // Ensures items fit in a 2-column grid.
    maxWidth: "48%",
  },
});
