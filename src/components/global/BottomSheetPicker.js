import React, { useRef, useMemo, useCallback, useState } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";

export default function BottomSheetPicker({
  label,
  options = [],
  selectedValue,
  onValueChange,
  placeholder = "Select an option...",
}) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const handleOpen = () => {
    setOpen(true);
    sheetRef.current?.expand();
  };

  const handleClose = () => {
    setOpen(false);
    sheetRef.current?.close();
  };

  const handleSelect = useCallback((option) => {
    onValueChange(option);
    handleClose();
  }, []);

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const bgColor = useThemeColor({}, "background");

  return (
    <View style={styles.container}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TouchableOpacity
        style={[styles.picker, { backgroundColor: bgColor }]}
        onPress={handleOpen}
      >
        <ThemedText style={{ color: selectedValue ? textColor : iconColor }}>
          {selectedValue || placeholder}
        </ThemedText>
        <Ionicons name="chevron-down" size={20} color={iconColor} />
      </TouchableOpacity>

      {open && (
        <BottomSheet
          ref={sheetRef}
          index={1}
          snapPoints={snapPoints}
          onClose={handleClose}
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <ThemedText>{item}</ThemedText>
              </TouchableOpacity>
            )}
          />
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  label: { marginBottom: 4 },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
