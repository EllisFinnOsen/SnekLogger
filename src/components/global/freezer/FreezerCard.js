// File: FreezerCard.js
import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { deleteFreezerItem } from "@/redux/actions";

const FreezerCard = ({ prey }) => {
  const dispatch = useDispatch();

  return (
    <View
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{prey.preyType}</Text>
      <Text>Quantity: {prey.quantity}</Text>
      <Text>
        Weight: {prey.preyWeight} {prey.preyWeightType}
      </Text>
      <Button
        title="🗑️ Remove"
        color="red"
        onPress={() => dispatch(deleteFreezerItem(prey.id))}
      />
    </View>
  );
};

export default FreezerCard;
