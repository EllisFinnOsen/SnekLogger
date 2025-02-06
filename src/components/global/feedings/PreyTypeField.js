import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import NestedSearchablePicker from "@/components/global/NestedSearchablePicker";
import { fetchFreezerItems } from "@/database/freezer";
import { PREY_TYPES } from "@/constants/FeedingTypes"; // ✅ Ensure we still include default prey types

export default function PreyTypeField({
  preyType,
  setPreyType,
  setFreezerId,
  isEditing,
}) {
  const [freezerItems, setFreezerItems] = useState([]);

  useEffect(() => {
    const loadFreezerItems = async () => {
      try {
        const items = await fetchFreezerItems();
        const formattedItems = items.map((item) => ({
          category: item.preyType
            ? `${item.preyType} (From Freezer)`
            : "Unknown Prey (From Freezer)", // ✅ Ensure valid name
          value: item.id, // Store freezer ID
        }));
        setFreezerItems(formattedItems);
      } catch (error) {
        console.error("Error fetching freezer items:", error);
      }
    };

    loadFreezerItems();
  }, []);

  const combinedOptions = [
    ...PREY_TYPES.map((type) => ({ category: type, value: type })), // ✅ Add default prey types
    ...freezerItems, // ✅ Append freezer prey options
  ];

  const handleSelectPrey = (selectedValue) => {
    const selectedItem = freezerItems.find(
      (item) => item.value === selectedValue
    );
    if (selectedItem) {
      setPreyType(selectedItem.category.replace(" (From Freezer)", ""));
      setFreezerId(selectedValue);
    } else {
      setPreyType(selectedValue);
      setFreezerId(null);
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} />
        <ThemedText type="default" style={styles.label}>
          Prey Type
        </ThemedText>
      </View>

      <NestedSearchablePicker
        options={combinedOptions}
        selectedValue={preyType}
        onValueChange={handleSelectPrey}
        placeholder="Select prey type..."
        otherLabel="Other (Enter custom prey type)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: { marginVertical: 8 },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  label: { marginLeft: 6 },
  icon: { marginRight: 6 },
});
