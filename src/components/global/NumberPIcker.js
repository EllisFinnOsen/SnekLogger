import React, { useRef, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3; // Shows 3 numbers at a time
const CENTER_OFFSET = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2; // Adjust for middle selection

const NumberPicker = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");

  const numbers = [];
  for (let i = min; i <= max; i += step) {
    numbers.push(i);
  }

  const flatListRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(numbers.indexOf(value));

  const handleScrollEnd = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round((yOffset + CENTER_OFFSET) / ITEM_HEIGHT);
    setSelectedIndex(index);
    onValueChange(numbers[index]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={numbers}
        keyExtractor={(item) => item.toString()}
        snapToAlignment="center"
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        initialScrollIndex={selectedIndex !== -1 ? selectedIndex : 0}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        onMomentumScrollEnd={handleScrollEnd} // ✅ Ensures final snap position selects the right number
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <View style={styles.itemContainer}>
              <Text
                style={[
                  styles.numberText,
                  {
                    color: isSelected ? textColor : iconColor,
                    fontWeight: isSelected ? "bold" : "normal",
                    fontSize: isSelected ? 24 : 18,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default NumberPicker;

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS, // Display 3 items at a time
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  itemContainer: {
    height: ITEM_HEIGHT, // Matches snap interval
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 18,
  },
});
