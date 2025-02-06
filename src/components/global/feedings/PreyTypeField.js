import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { PREY_TYPES } from "@/constants/FeedingTypes";
import { useThemeColor } from "@/hooks/useThemeColor";
import NestedSearchablePicker from "@/components/global/NestedSearchablePicker";
import { fetchFreezerItems } from "@/database/freezer";

export default function PreyTypeField({
  preyType,
  setPreyType,
  setFreezerId,
  isEditing,
  errorMessage, // Receive error message
}) {
  const [freezerItems, setFreezerItems] = useState([]);
  const iconColor = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "error");
  useEffect(() => {
    const loadFreezerItems = async () => {
      try {
        const items = await fetchFreezerItems();
        const formattedItems = items.map((item) => ({
          category: `${item.preyType} (From Freezer)`,
          value: item.id, // Store freezer ID
        }));
        setFreezerItems(formattedItems);
      } catch (error) {
        console.error("Error fetching freezer items:", error);
      }
    };

    loadFreezerItems();
  }, []);

  const handleSelectPrey = (selectedValue) => {
    const selectedItem = freezerItems.find(
      (item) => item.value === selectedValue
    );
    if (selectedItem) {
      setPreyType(selectedItem.category.replace(" (From Freezer)", ""));
      setFreezerId(selectedValue); // Store the freezer item ID
    } else {
      setPreyType(selectedValue);
      setFreezerId(null); // Reset if it's not from freezer
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.titleContainer}>
        <Ionicons style={styles.icon} name="fish" size={18} />
        <ThemedText type="default" style={[styles.label, { color: iconColor }]}>
          Prey Type
        </ThemedText>
      </View>

      <NestedSearchablePicker
        options={freezerItems}
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
