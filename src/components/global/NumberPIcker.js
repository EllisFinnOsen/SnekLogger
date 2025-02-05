// File: NumberPicker.js
import React from "react";
import { View, Text, ScrollView } from "react-native";

const NumberPicker = ({ value, onValueChange }) => {
  const numbers = Array.from({ length: 101 }, (_, i) => i); // 0 to 100

  return (
    <View
      style={{ height: 100, alignItems: "center", justifyContent: "center" }}
    >
      <ScrollView
        style={{ height: 80 }}
        contentContainerStyle={{ alignItems: "center" }}
        snapToAlignment="center"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / 40);
          onValueChange(numbers[index]);
        }}
      >
        {numbers.map((num) => (
          <View key={num} style={{ height: 40, justifyContent: "center" }}>
            <Text style={{ fontSize: 22 }}>{num}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NumberPicker;
