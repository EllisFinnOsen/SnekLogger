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
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchFreezerItemsWithWarnings, addFreezerItem } from "@/redux/actions";
import { selectFreezerItems } from "@/redux/selectors";
import FreezerCard from "@/components/global/freezer/FreezerCard";
import ThemedScrollView from "@/components/global/ThemedScrollView";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { SIZES } from "@/constants/Theme";
import EditHeader from "@/components/global/EditHeader";

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
    <ThemedScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Freezer Stock
        </ThemedText>
        <EditHeader
          label="Track your stock"
          description="Add prey and quantites below and then track your stock by attaching them to feeding logs."
        />

        <View style={{ flex: 1 }}>
          <Button
            title="➕ Add to Freezer"
            onPress={() => setModalVisible(true)}
          />

          <FlatList
            data={Array.isArray(freezerItems) ? freezerItems : []} // ✅ Ensure array
            keyExtractor={(item) =>
              item?.id?.toString() || Math.random().toString()
            } // ✅ Avoid undefined keys
            renderItem={({ item }) => item && <FreezerCard prey={item} />} // ✅ Ensure valid item
          />

          {/* Add Prey Modal */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
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
      </ThemedView>
    </ThemedScrollView>
  );
};

export default FreezerScreen;

const styles = StyleSheet.create({
  title: {
    marginBottom: SIZES.xLarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
