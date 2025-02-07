import React, { useState } from "react";
import { View, Modal, StyleSheet } from "react-native";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import PreyTypeField from "@/components/global/feedings/PreyTypeField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import QuantityField from "@/components/QuantityField";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function AddFreezerModal({ visible, onClose, onAddPrey }) {
  // Form State
  const [preyType, setPreyType] = useState("");
  const [preyTypeError, setPreyTypeError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [preyWeight, setPreyWeight] = useState("");
  const [preyWeightError, setPreyWeightError] = useState("");
  const [preyWeightType, setPreyWeightType] = useState("g");

  // Theme Colors
  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const backgroundColor = useThemeColor({}, "background");

  const handleAddPrey = () => {
    let isValid = true;

    // Validate prey type
    if (!preyType.trim()) {
      setPreyTypeError("Prey type is required.");
      isValid = false;
    } else {
      setPreyTypeError("");
    }

    // Validate quantity (Required)
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setQuantityError("Quantity is required.");
      isValid = false;
    } else {
      setQuantityError("");
    }

    // Prey weight is OPTIONAL, but validate if present
    if (preyWeight && (isNaN(preyWeight) || preyWeight < 0)) {
      setPreyWeightError("Invalid weight value.");
      isValid = false;
    } else {
      setPreyWeightError("");
    }

    if (!isValid) return;

    // Send data back to parent
    onAddPrey({
      preyType,
      quantity: parseInt(quantity),
      preyWeight: preyWeight ? parseFloat(preyWeight) : 0,
      preyWeightType,
    });

    // Reset fields
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setPreyType("");
    setPreyTypeError("");
    setQuantity("");
    setQuantityError("");
    setPreyWeight("");
    setPreyWeightError("");
    setPreyWeightType("g");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <EditHeader
            label="Add Prey to Freezer"
            description="Select prey type, weight, and quantity."
          />

          {/* Prey Type Field */}
          <PreyTypeField
            preyType={preyType}
            setPreyType={setPreyType}
            isEditing={true}
            errorMessage={preyTypeError}
            hideFreezerItems={true}
          />

          <View style={styles.preyRow}>
            {/* Quantity Field (Required) */}
            <QuantityField
              quantity={quantity}
              setQuantity={setQuantity}
              isEditing={true}
              errorMessage={quantityError}
            />

            {/* Prey Weight Field (Optional) */}
            <WeightField
              weight={preyWeight}
              setWeight={setPreyWeight}
              weightType={preyWeightType}
              setWeightType={setPreyWeightType}
              isEditing={true}
              errorMessage={preyWeightError}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonWrap}>
            <CustomButton
              title="Cancel"
              onPress={() => {
                resetForm();
                onClose();
              }}
              style={[styles.cancelButton, { backgroundColor: fieldColor }]}
            />
            <CustomButton
              title="Add"
              onPress={handleAddPrey}
              style={[styles.addButton, { backgroundColor: activeColor }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
