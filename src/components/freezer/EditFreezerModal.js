import React, { useState, useEffect } from "react";
import { View, Modal, StyleSheet } from "react-native";
import EditHeader from "@/components/global/EditHeader";
import CustomButton from "@/components/global/CustomButton";
import PreyTypeField from "@/components/global/feedings/PreyTypeField";
import WeightField from "@/components/global/pets/add_pet/WeightField";
import QuantityField from "@/components/QuantityField";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDispatch } from "react-redux";
import { updateFreezerItem, deleteFreezerItem } from "@/redux/actions";
import { updateFreezerItemInDB } from "@/database";

export default function EditFreezerModal({ visible, prey, onClose }) {
  const dispatch = useDispatch();

  const [preyType, setPreyType] = useState(prey.preyType);
  const [preyTypeError, setPreyTypeError] = useState("");
  const [quantity, setQuantity] = useState(prey.quantity);
  const [quantityError, setQuantityError] = useState("");
  const [preyWeight, setPreyWeight] = useState(prey.weight);
  const [preyWeightError, setPreyWeightError] = useState("");
  const [preyWeightType, setPreyWeightType] = useState(prey.weightType);

  useEffect(() => {
    if (prey) {
      setPreyType(prey.preyType);
      setQuantity(prey.quantity);
      setPreyWeight(prey.weight);
      setPreyWeightType(prey.weightType);
    }
  }, [prey]);

  const fieldColor = useThemeColor({}, "field");
  const activeColor = useThemeColor({}, "active");
  const backgroundColor = useThemeColor({}, "background");

  const handleUpdatePrey = () => {
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

    // Dispatch update action
    dispatch(
      updateFreezerItem(prey.id, preyType, quantity, preyWeight, preyWeightType)
    );

    onClose();
  };

  const handleDeletePrey = () => {
    dispatch(deleteFreezerItem(prey.id));
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <EditHeader
            label="Edit Freezer Item"
            description="Modify prey details below."
          />

          {/* Prey Type Field */}
          <PreyTypeField
            preyType={preyType}
            setPreyType={setPreyType}
            isEditing={true}
            errorMessage={preyTypeError}
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
              title="Delete"
              onPress={handleDeletePrey}
              style={[styles.deleteButton, { backgroundColor: "red" }]}
            />
            <CustomButton
              title="Cancel"
              onPress={onClose}
              style={[styles.cancelButton, { backgroundColor: fieldColor }]}
            />
            <CustomButton
              title="Update"
              onPress={handleUpdatePrey}
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
  deleteButton: {
    width: "30%",
  },
  cancelButton: {
    width: "30%",
  },
  addButton: {
    width: "30%",
  },
});
