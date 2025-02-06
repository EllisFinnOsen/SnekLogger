// File: PreyTypeField.js
import React, { useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { PREY_TYPES } from "@/constants/FeedingTypes";
import { useThemeColor } from "@/hooks/useThemeColor";
import NestedSearchablePicker from "@/components/global/NestedSearchablePicker";
import PreyTypeSelectionModal from "@/components/global/PreyTypeSelectionModal";
import CustomButton from "@/components/global/CustomButton";
import FreezerSelectionModal from "../freezer/FreezerSelectionModal";
import { useDispatch } from "react-redux";
import { linkFeedingWithFreezer } from "@/redux/actions/freezerActions";
import EditHeader from "../EditHeader";

export default function PreyTypeField({
  preyType,
  setPreyType,
  isEditing,
  errorMessage,
  showSelectionModal = false,
  feedingId,
}) {
  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [freezerModalVisible, setFreezerModalVisible] = useState(false);
  const [generalListModalVisible, setGeneralListModalVisible] = useState(false);

  const dispatch = useDispatch();

  const handleSelectOption = (option) => {
    setSelectionModalVisible(false);

    if (option === "freezer") {
      setFreezerModalVisible(true);
    } else {
      setGeneralListModalVisible(true);
    }
  };

  const handleSelectFromFreezer = (selectedPrey) => {
    setPreyType(selectedPrey.preyType);

    if (feedingId) {
      dispatch(linkFeedingWithFreezer(feedingId, selectedPrey.id, 1));
    }

    setFreezerModalVisible(false);
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} color={iconColor} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Prey Type
        </ThemedText>
      </View>

      {showSelectionModal ? (
        <TouchableOpacity
          onPress={() => setSelectionModalVisible(true)}
          style={styles.inputWrapper}
        >
          <ThemedText type="default">
            {preyType || "Select Prey Type"}
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <NestedSearchablePicker
          options={PREY_TYPES}
          selectedValue={preyType}
          onValueChange={setPreyType}
          placeholder="Select..."
          otherLabel="Other (Enter custom prey type)"
          errorMessage={errorMessage}
        />
      )}

      <Modal visible={selectionModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor }]}>
            <EditHeader
              label="Choose Source"
              description="Track your Freezer stock or simply select from the General List"
            />
            <CustomButton
              title="Add From Freezer"
              onPress={() => handleSelectOption("freezer")}
            />
            <CustomButton
              title="Add From General List"
              onPress={() => handleSelectOption("general")}
            />
            <CustomButton
              title="Cancel"
              onPress={() => setSelectionModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <FreezerSelectionModal
        visible={freezerModalVisible}
        onSelect={handleSelectFromFreezer}
        onClose={() => setFreezerModalVisible(false)}
      />

      <PreyTypeSelectionModal
        visible={generalListModalVisible}
        onClose={() => setGeneralListModalVisible(false)}
        options={PREY_TYPES}
        onSelect={setPreyType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: { marginVertical: 8 },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 6 },
  icon: { marginRight: 6 },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
});
