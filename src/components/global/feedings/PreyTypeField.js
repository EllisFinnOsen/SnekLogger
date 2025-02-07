import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { PREY_TYPES } from "@/constants/FeedingTypes";
import { useThemeColor } from "@/hooks/useThemeColor";
import NestedSearchablePicker from "@/components/global/NestedSearchablePicker";

import { useDispatch, useSelector } from "react-redux";
import { selectFreezerItems } from "@/redux/selectors";
import { fetchFreezerItemsWithWarnings } from "@/redux/actions";

export default function PreyTypeField({
  preyType,
  setPreyType,
  isEditing,
  errorMessage,
  onFreezerSelection = null, // ✅ Optional, prevents errors
  hideFreezerItems = false, // ✅ Controls freezer logic visibility
}) {
  const dispatch = useDispatch();
  const freezerItems = useSelector(selectFreezerItems);
  const [selectedFreezerId, setSelectedFreezerId] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [tempPreyType, setTempPreyType] = useState(null);
  const [matchingFreezerItem, setMatchingFreezerItem] = useState(null);

  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error");

  useEffect(() => {
    dispatch(fetchFreezerItemsWithWarnings());
  }, [dispatch]);

  const handlePreySelection = (selectedPrey) => {
    if (!hideFreezerItems) {
      const freezerMatch = freezerItems.find(
        (item) => item.preyType === selectedPrey
      );
      if (freezerMatch) {
        setMatchingFreezerItem(freezerMatch);
        setTempPreyType(selectedPrey);
        setConfirmModalVisible(true);
        return;
      }
    }

    setPreyType(selectedPrey);
    setSelectedFreezerId(null);
    onFreezerSelection && onFreezerSelection(null); // ✅ Only call if function exists
  };

  const handleConfirmFreezer = () => {
    setPreyType(tempPreyType);
    setSelectedFreezerId(matchingFreezerItem.id);
    onFreezerSelection && onFreezerSelection(matchingFreezerItem.id); // ✅ Only call if function exists
    setConfirmModalVisible(false);
  };

  const handleDeclineFreezer = () => {
    setPreyType(tempPreyType);
    setSelectedFreezerId(null);
    onFreezerSelection && onFreezerSelection(null); // ✅ Only call if function exists
    setConfirmModalVisible(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Prey Type
        </ThemedText>
      </View>

      <NestedSearchablePicker
        options={PREY_TYPES}
        freezerItems={hideFreezerItems ? [] : freezerItems} // ✅ Hide freezer items if needed
        selectedValue={preyType}
        onValueChange={handlePreySelection}
        placeholder="Select..."
        otherLabel="Other (Enter custom prey type)"
        errorMessage={errorMessage}
      />

      {/* ✅ Confirmation Modal for Freezer Selection (Only if NOT hiding freezer logic) */}
      {!hideFreezerItems && (
        <Modal visible={confirmModalVisible} transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: "white" }]}>
              <ThemedText type="default" style={{ textAlign: "center" }}>
                You have {matchingFreezerItem?.quantity} of {tempPreyType} in
                your freezer. Would you like to use them?
              </ThemedText>
              <TouchableOpacity
                onPress={handleConfirmFreezer}
                style={styles.confirmButton}
              >
                <ThemedText type="default">Yes</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeclineFreezer}
                style={styles.cancelButton}
              >
                <ThemedText type="default">No</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: { marginVertical: 8 },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 6 },
  icon: { marginRight: 6 },
  errorText: { marginTop: 4, fontSize: 12 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
