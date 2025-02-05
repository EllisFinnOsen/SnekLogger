import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchFreezerItemsWithWarnings, addFreezerItem } from "@/redux/actions";
import { selectFreezerItems } from "@/redux/selectors";
import FreezerCard from "@/components/global/freezer/FreezerCard";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";
import PreyTypeField from "@/components/global/feedings/PreyTypeField";
import NumberPicker from "@/components/global/NumberPIcker";
import { Ionicons } from "@expo/vector-icons";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import NumericPickerModal from "@/components/global/NumericPickerModal";

const FreezerScreen = () => {
  const dispatch = useDispatch();
  const freezerItems = useSelector(selectFreezerItems);

  const [modalVisible, setModalVisible] = useState(false);
  const [preyType, setPreyType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preyWeight, setPreyWeight] = useState("");
  const [preyWeightType, setPreyWeightType] = useState("g");
  const [pickerVisible, setPickerVisible] = useState(false);

  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const errorColor = useThemeColor({}, "error");
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    dispatch(fetchFreezerItemsWithWarnings());
  }, [dispatch]);

  const handleAddPrey = () => {
    if (!preyType || !quantity || !preyWeight) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    dispatch(
      addFreezerItem(
        preyType,
        parseInt(quantity),
        parseFloat(preyWeight),
        preyWeightType
      )
    );
    setModalVisible(false);
    setPreyType("");
    setQuantity("");
    setPreyWeight("");
    setPreyWeightType("g");
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

          {freezerItems && freezerItems.length > 0 ? (
            freezerItems.map((item) => (
              <FreezerCard
                key={item?.id?.toString() || Math.random().toString()}
                prey={item}
              />
            ))
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No prey items in freezer.
            </Text>
          )}

          {/* Add Prey Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContainer,
                  { backgroundColor: backgroundColor },
                ]}
              >
                <ThemedText type="subtitle">Add Prey to Freezer</ThemedText>

                {/* Prey Type & Weight Field */}
                <View style={styles.preyRow}>
                  <View style={styles.preyWrap}>
                    <PreyTypeField
                      value={preyType}
                      preyType={preyType}
                      setPreyType={setPreyType}
                      isEditing={true}
                    />
                  </View>
                  <View style={styles.weightWrap}>
                    <WeightField
                      weight={preyWeight}
                      setWeight={setPreyWeight}
                      weightType={preyWeightType}
                      setWeightType={setPreyWeightType}
                      isEditing={true}
                    />
                  </View>
                </View>

                {/* Quantity Field (Opens Number Picker) */}
                <View style={styles.fieldContainer}>
                  <TouchableOpacity
                    onPress={() => setPickerVisible(true)}
                    style={styles.inputWrapper}
                  >
                    <View style={styles.titleContainer}>
                      <Ionicons
                        name="chevron-expand-outline"
                        size={18}
                        color={iconColor}
                        style={styles.icon}
                      />
                      <ThemedText
                        type="default"
                        style={[styles.label, { color: iconColor }]}
                      >
                        Quantity
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.answer,
                        { backgroundColor, borderColor: iconColor },
                      ]}
                    >
                      <ThemedText type="default">
                        {quantity || "Select quantity"}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Buttons */}
                <View style={styles.buttonWrap}>
                  <CustomButton
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                    style={[
                      styles.cancelButton,
                      { backgroundColor: fieldColor },
                    ]}
                  />
                  <CustomButton
                    title="Add"
                    onPress={handleAddPrey}
                    style={[styles.addButton, { backgroundColor: activeColor }]}
                  />
                </View>
              </View>
            </View>

            {/* Number Picker Modal */}
            <NumericPickerModal
              visible={pickerVisible}
              title="Select Quantity"
              value={quantity}
              onValueChange={setQuantity}
              onClose={() => setPickerVisible(false)}
              min={1}
              max={100}
              step={1}
            />
          </Modal>
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
  fieldContainer: {},
  preyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12, // Ensures spacing between elements is uniform
    borderRadius: 5,
    padding: 8,
  },

  preyWrap: {
    flex: 1,
    justifyContent: "center", // Ensures alignment consistency
  },

  weightWrap: {
    flex: 1,
    justifyContent: "center", // Ensures alignment consistency
    flexDirection: "row", // Aligns weight input and unit picker horizontally
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
  inputWrapper: {
    borderRadius: 5,
    paddingHorizontal: 12,

    alignItems: "flex-start",
  },
  answer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    width: "100%",
    textAlign: "center",
  },
  cancelButton: {
    width: "46%",
  },
  addButton: {
    width: "46%",
    marginLeft: 8,
  },
  numberPickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  buttonWrap: {
    paddingTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
