import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/global/ThemedText";
import { ThemedView } from "@/components/global/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { checkImageURL } from "@/utils/checkImage";
import { SIZES } from "@/constants/Theme";

export default function ExistingPetPicker({
  items,
  selectedValue,
  onValueChange,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const bgColor = useThemeColor({}, "bgColor");

  const handleSelect = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View>
      {/* Picker button styled like your existing pet button */}
      <TouchableOpacity
        testID="dropdown-button"
        style={[
          styles.dropdown,
          { backgroundColor: fieldColor, borderColor: iconColor },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="default">
          {items.find((item) => item.value === selectedValue)?.label ||
            "Select existing pet"}
        </ThemedText>
        <Ionicons name="chevron-down" size={24} color={textColor} />
      </TouchableOpacity>

      {/* Modal popup with the list */}
      <Modal
        testID="dropdown-modal"
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView
            style={[styles.modalContent, { backgroundColor: fieldColor }]}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, { borderBottomColor: fieldAccent }]}
                  onPress={() => handleSelect(item)}
                >
                  <Image
                    source={{
                      uri: checkImageURL(item.imageURL)
                        ? item.imageURL
                        : "https://via.placeholder.com/50",
                    }}
                    style={styles.itemImage}
                  />
                  <ThemedText type="subtitle" style={{ color: textColor }}>
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />

            {/* Clear selection button */}
            <TouchableOpacity
              style={[
                styles.clearButton,
                { backgroundColor: fieldColor, borderColor: iconColor },
              ]}
              onPress={() => {
                onValueChange(null);
                setModalVisible(false);
              }}
            >
              <ThemedText type="default">Clear selection</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: fieldColor, borderColor: iconColor },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText type="default">Cancel</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "50%",
    borderRadius: 5,
    padding: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: SIZES.xSmall,
    marginRight: 16,
  },
  clearButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
    padding: 10,
  },
});
