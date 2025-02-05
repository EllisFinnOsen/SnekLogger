// GroupScreen.js
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import AddPetCard from "@/components/global/pets/AddPetCard";
import AddPetPickerModal from "@/components/global/pets/add_pet/AddPetPickerModal";
// Import your memoized selectors
import { makeSelectGroupPets, selectGroupById } from "@/redux/selectors";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import EditHeader from "@/components/global/EditHeader";
import HeaderSection from "@/components/global/pets/add_pet/HeaderSection";
import { fetchPetsByGroupId } from "@/redux/actions";

export default function GroupScreen({ route, navigation }) {
  const { groupId } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    if (groupId) {
      dispatch(fetchPetsByGroupId(groupId));
    }
  }, [dispatch, groupId]);

  // Use the memoized selector for group pets.
  const selectPets = makeSelectGroupPets();
  const pets = useSelector((state) => selectPets(state, groupId), shallowEqual);

  // Use the memoized selector for the group details.
  const group = useSelector((state) => selectGroupById(state, groupId));
  const groupName = group ? group.name : `Group ${groupId}`;
  const groupNotes = group ? group.notes : "";

  const [pickerVisible, setPickerVisible] = useState(false);

  const dataWithFooter = [...pets, { id: "add-pet", type: "add" }];

  const handleAddCardPress = () => {
    setPickerVisible(true);
  };

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

  // GroupScreen.js
  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        isEditing={false} // false by default so it shows "Edit"
        onEdit={() => navigation.navigate("EditGroupScreen", { groupId })}
        onCancel={() => {
          // Optional: define behavior if needed when cancelling edit mode.
        }}
        onBack={() => navigation.goBack()}
      />

      <EditHeader label={groupName} description={groupNotes} />

      {pets.length > 0 ? (
        <FlatList
          data={[...pets, { id: "add-pet", type: "add" }]}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
        />
      ) : (
        // If no pets are available, render AddPetCard above the "No pets found" text.
        <View style={styles.noPetsContainer}>
          <TouchableOpacity
            onPress={handleAddCardPress}
            style={styles.cardContainer}
          >
            <AddPetCard />
          </TouchableOpacity>
        </View>
      )}

      {pickerVisible && (
        <AddPetPickerModal
          visible={pickerVisible}
          groupId={groupId}
          onSelectOption={(option, selectedId) => {
            if (option === "new") {
              navigation.navigate("AddPetScreen", { groupId });
            }
            // Handle "existing" case as needed
          }}
          onClose={() => setPickerVisible(false)}
        />
      )}
    </ThemedScrollView>
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
    maxWidth: "48%",
  },
});
