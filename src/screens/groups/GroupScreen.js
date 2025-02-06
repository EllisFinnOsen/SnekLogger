// GroupScreen.js
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import AddPetCard from "@/components/global/pets/AddPetCard";
import AddPetPickerModal from "@/components/global/pets/add_pet/AddPetPickerModal";
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

  const selectPets = makeSelectGroupPets();
  const pets = useSelector((state) => selectPets(state, groupId), shallowEqual);

  const group = useSelector((state) => selectGroupById(state, groupId));
  const groupName = group ? group.name : `Group ${groupId}`;
  const groupNotes = group ? group.notes : "";

  const [pickerVisible, setPickerVisible] = useState(false);

  const handleAddCardPress = () => {
    setPickerVisible(true);
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <HeaderSection
        isEditing={false}
        onEdit={() => navigation.navigate("EditGroupScreen", { groupId })}
        onBack={() => navigation.goBack()}
      />

      <EditHeader label={groupName} description={groupNotes} />

      <View style={styles.listContainer}>
        {pets.length > 0 ? (
          [...pets, { id: "add-pet", type: "add" }].map((item) => (
            <View key={item.id} style={styles.cardContainer}>
              {item.type === "add" ? (
                <TouchableOpacity onPress={handleAddCardPress}>
                  <AddPetCard />
                </TouchableOpacity>
              ) : (
                <PrimaryPetCard pet={item} />
              )}
            </View>
          ))
        ) : (
          <View style={styles.noPetsContainer}>
            <TouchableOpacity
              onPress={handleAddCardPress}
              style={styles.cardContainer}
            >
              <AddPetCard />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {pickerVisible && (
        <AddPetPickerModal
          visible={pickerVisible}
          groupId={groupId}
          onSelectOption={(option, selectedId) => {
            if (option === "new") {
              navigation.navigate("AddPetScreen", { groupId });
            }
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
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContainer: {
    flexBasis: "48%",
    marginBottom: 16,
  },
  noPetsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
