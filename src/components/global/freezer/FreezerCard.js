// File: FreezerCard.js
import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, Modal } from "react-native";
import { useDispatch } from "react-redux";
import { deleteFreezerItem, updateFreezerItem } from "@/redux/actions";
import NumberPicker from "../NumberPIcker";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { LuWorm } from "react-icons/lu";
import { GiCricket } from "react-icons/gi";

const FreezerCard = ({ prey }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(prey.quantity);

  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const activeColor = useThemeColor({}, "active");
  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error"); // For border if feeding is late
  const errorSubtle = useThemeColor({}, "errorSubtle"); // For background if feeding is late

  const handleDelete = () => {
    dispatch(deleteFreezerItem(prey.id));
    setModalVisible(false);
  };

  const handleUpdateQuantity = () => {
    dispatch(updateFreezerItem(prey.id, selectedQuantity));
    setPickerVisible(false);
  };

  return (
    <View
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: fieldColor,
        borderRadius: 10,
      }}
    >
      <Ionicons name="bug-sharp" size={24} color={iconColor} />
      <MaterialCommunityIcons name="rodent" size={24} color={iconColor} />
      <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
        {prey.preyType}: {prey.quantity}
      </ThemedText>
      <ThemedText>
        Weight: ~{prey.weight} {prey.weightType}
      </ThemedText>

      {/* Manage Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: "#007bff",
          padding: 8,
          borderRadius: 5,
          marginTop: 5,
        }}
      >
        <ThemedText style={{ color: "white", textAlign: "center" }}>
          Manage
        </ThemedText>
      </TouchableOpacity>

      {/* Manage Options Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
          >
            <ThemedText style={{ fontSize: 18, marginBottom: 10 }}>
              Manage {prey.preyType}
            </ThemedText>

            <Button
              title="Change Quantity"
              onPress={() => {
                setPickerVisible(true);
                setModalVisible(false);
              }}
            />
            <Button
              title="Remove From Freezer"
              color="red"
              onPress={handleDelete}
            />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Number Picker Modal */}
      <Modal visible={pickerVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Change Quantity
            </Text>

            {/* Number Picker */}
            <NumberPicker
              value={selectedQuantity}
              onValueChange={setSelectedQuantity}
            />

            <Button title="Update" onPress={handleUpdateQuantity} />
            <Button title="Cancel" onPress={() => setPickerVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FreezerCard;
