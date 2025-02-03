// AddPetPickerModal.jsx
import React, { useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import ExistingPetPicker from "./ExistingPetPicker";
import { useFocusEffect } from "@react-navigation/native";
import { addPetToGroupAction, fetchPets } from "@/redux/actions";
import { useDispatch, useSelector } from "react-redux";

export default function AddPetPickerModal({
  visible,
  groupId, // Make sure groupId is accepted as a prop
  onSelectOption,
  onClose,
}) {
  const dispatch = useDispatch();
  // Get all pets from Redux
  const allPets = useSelector((state) => state.pets.pets || []);
  // Get the pets already in the group from Redux (assumed to be stored as full pet objects)
  const groupPets = useSelector(
    (state) => (state.groups.groupPets && state.groups.groupPets[groupId]) || []
  );

  // Filter available pets to only those not in the group.
  const availablePets = allPets.filter(
    (pet) => !groupPets.some((gp) => gp.id === pet.id)
  );

  const textColor = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const active = useThemeColor({}, "active");
  const fieldColor = useThemeColor({}, "field");

  const [selectedPetId, setSelectedPetId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchPets()); // Fetch pets for the picker
    }, [dispatch])
  );

  const handleSave = async () => {
    if (selectedPetId == null) return;
    if (!groupId) {
      //console.error("No groupId provided; cannot add pet to group.");
      return;
    }
    try {
      await dispatch(addPetToGroupAction(groupId, selectedPetId));
      if (onSelectOption) {
        onSelectOption("existing", selectedPetId);
      }
      setSelectedPetId(null);
      onClose();
    } catch (error) {
      //console.error("Error saving pet to group:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { backgroundColor: background }]}>
          {/* Render the ExistingPetPicker with only available pets */}
          <ExistingPetPicker
            items={availablePets.map((pet) => ({
              label: pet.name,
              value: pet.id,
              imageURL: pet.imageURL,
            }))}
            selectedValue={selectedPetId}
            onValueChange={(value) => {
              setSelectedPetId(value);
            }}
          />

          {/* Button Row */}
          <View style={styles.buttonRow}>
            {selectedPetId === null ? (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: active, borderColor: active },
                ]}
                onPress={() => onSelectOption("new")}
              >
                <ThemedText type="default">Add New Pet</ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { backgroundColor: active, borderColor: active },
                ]}
                onPress={handleSave}
              >
                <ThemedText type="default">Save</ThemedText>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.cancelButton,
                { backgroundColor: fieldColor, borderColor: textColor },
              ]}
            >
              <ThemedText type="default">Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
});
