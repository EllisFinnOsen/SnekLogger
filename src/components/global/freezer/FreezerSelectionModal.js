// File: FreezerSelectionModal.js
import React, { useEffect } from "react";
import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useDispatch, useSelector } from "react-redux";
import { selectFreezerItems } from "@/redux/selectors";
import CustomButton from "@/components/global/CustomButton";
import { fetchFreezerItemsAction } from "@/redux/actions";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function FreezerSelectionModal({ visible, onSelect, onClose }) {
  const dispatch = useDispatch();
  const freezerItems = useSelector(selectFreezerItems);

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");
  const fieldAccent = useThemeColor({}, "fieldAccent");

  // ✅ Fetch freezer items when modal opens
  useEffect(() => {
    if (visible) {
      dispatch(fetchFreezerItemsAction());
    }
  }, [visible, dispatch]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: bgColor }]}>
          <ThemedText type="subtitle">Select Prey From Freezer</ThemedText>
          <FlatList
            data={freezerItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.listItem, { borderBottomColor: fieldAccent }]}
                onPress={() => onSelect(item)}
              >
                <ThemedText type="default">
                  {item.preyType} ({item.quantity} left)
                </ThemedText>
              </TouchableOpacity>
            )}
          />
          <CustomButton title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    width: "100%",
  },
});
