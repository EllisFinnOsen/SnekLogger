// File: NumericPickerModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Modal,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomButton from "@/components/global/CustomButton";

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const CENTER_OFFSET = (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2;

const NumericPickerModal = ({
  visible,
  title,
  value,
  onValueChange,
  onClose,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const iconColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const activeColor = useThemeColor({}, "active");
  const backgroundColor = useThemeColor({}, "background");
  const fieldColor = useThemeColor({}, "field");

  const numbers = Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, i) => min + i * step
  );

  const flatListRef = useRef(null);
  const getClosestIndex = (val) => {
    return numbers.findIndex((num) => num >= val);
  };

  const [selectedIndex, setSelectedIndex] = useState(getClosestIndex(value));

  useEffect(() => {
    if (visible) {
      const index = getClosestIndex(value);
      setSelectedIndex(index);
      if (flatListRef.current && index !== -1) {
        setTimeout(() => {
          flatListRef.current.scrollToIndex({
            index,
            animated: true,
          });
        }, 100);
      }
    }
  }, [visible]);

  const handleScrollEnd = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round((yOffset + CENTER_OFFSET) / ITEM_HEIGHT);
    setSelectedIndex(index);
    onValueChange(numbers[index]);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: backgroundColor }]}
        >
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>

          <View style={styles.listWrapper}>
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
              onMomentumScrollEnd={handleScrollEnd}
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

          {/* Confirm & Cancel Buttons */}
          <View style={styles.buttonWrap}>
            <CustomButton
              title="Cancel"
              onPress={onClose}
              style={[styles.cancelButton, { backgroundColor: fieldColor }]}
            />
            <CustomButton
              title="Confirm"
              onPress={onClose}
              style={[styles.confirmButton, { backgroundColor: activeColor }]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NumericPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    padding: 20,
    borderRadius: 10,
    width: 280,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  listWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: "hidden",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: 18,
  },
  cancelButton: {
    width: "46%",
  },
  confirmButton: {
    width: "46%",
    marginLeft: 8,
  },
  buttonWrap: {
    paddingTop: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
