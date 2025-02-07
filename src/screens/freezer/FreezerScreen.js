import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectFreezerItems } from "@/redux/selectors";
import FreezerCard from "@/components/global/freezer/FreezerCard";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import EditHeader from "@/components/global/EditHeader";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";
import AddFreezerModal from "@/components/freezer/AddFreezerModal";
import { addFreezerItem, fetchFreezerItemsWithWarnings } from "@/redux/actions";

const FreezerScreen = () => {
  const dispatch = useDispatch();
  const freezerItems = useSelector(selectFreezerItems);
  const [modalVisible, setModalVisible] = useState(false);

  const activeColor = useThemeColor({}, "active");

  useEffect(() => {
    dispatch(fetchFreezerItemsWithWarnings());
  }, [dispatch]);

  const handleAddPrey = (newPrey) => {
    dispatch(
      addFreezerItem(
        newPrey.preyType,
        newPrey.quantity,
        newPrey.preyWeight,
        newPrey.preyWeightType
      )
    );
  };

  return (
    <ThemedScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Your Freezer
        </ThemedText>
        <EditHeader
          label="Track your stock"
          description="Add prey and quantities below and then track your stock by attaching them to feeding logs."
        />

        <View style={{ flex: 1, paddingTop: 32 }}>
          <CustomButton
            title="+ Add to Freezer"
            onPress={() => setModalVisible(true)}
            style={[styles.saveButton, { backgroundColor: activeColor }]}
          />

          <View style={{ paddingBottom: 32 }} />

          {freezerItems.length > 0 ? (
            freezerItems.map((item) => (
              <FreezerCard
                key={item?.id?.toString() || Math.random().toString()}
                prey={item}
              />
            ))
          ) : (
            <ThemedText
              type="smDetail"
              style={{ textAlign: "center", marginTop: 20 }}
            ></ThemedText>
          )}

          {/* Add Prey Modal */}
          <AddFreezerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onAddPrey={handleAddPrey}
          />
        </View>
      </ThemedView>
    </ThemedScrollView>
  );
};

export default FreezerScreen;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    width: 320,
  },
  preyRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    borderRadius: 5,
    paddingVertical: 4,
  },
  buttonWrap: {
    paddingTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    width: "46%",
  },
  addButton: {
    width: "46%",
    marginLeft: 8,
  },
});
