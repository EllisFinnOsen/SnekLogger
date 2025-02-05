// File: FreezerScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchFreezerItemsWithWarnings, addFreezerItem } from "@/redux/actions";
import { selectFreezerItems } from "@/redux/selectors";
import FreezerCard from "@/components/global/freezer/FreezerCard";

const FreezerScreen = () => {
  const dispatch = useDispatch();
  const freezerItems = useSelector(selectFreezerItems);

  const [modalVisible, setModalVisible] = useState(false);
  const [preyType, setPreyType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [preyWeight, setPreyWeight] = useState("");
  const [preyWeightType, setPreyWeightType] = useState("g");

  useEffect(() => {
    dispatch(fetchFreezerItemsWithWarnings()); // ✅ Corrected function call
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
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="➕ Add to Freezer" onPress={() => setModalVisible(true)} />

      <FlatList
        data={Array.isArray(freezerItems) ? freezerItems : []} // ✅ Ensure array
        keyExtractor={(item) =>
          item?.id?.toString() || Math.random().toString()
        } // ✅ Avoid undefined keys
        renderItem={({ item }) => item && <FreezerCard prey={item} />} // ✅ Ensure valid item
      />

      {/* Add Prey Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
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
            <Text>Add Prey to Freezer</Text>
            <TextInput
              placeholder="Prey Type"
              value={preyType}
              onChangeText={setPreyType}
              style={{ borderBottomWidth: 1 }}
            />
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              style={{ borderBottomWidth: 1 }}
            />
            <TextInput
              placeholder="Prey Weight"
              keyboardType="numeric"
              value={preyWeight}
              onChangeText={setPreyWeight}
              style={{ borderBottomWidth: 1 }}
            />
            <TextInput
              placeholder="Weight Type (g/kg)"
              value={preyWeightType}
              onChangeText={setPreyWeightType}
              style={{ borderBottomWidth: 1 }}
            />

            <Button title="Add" onPress={handleAddPrey} />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FreezerScreen;
