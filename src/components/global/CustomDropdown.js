import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { checkImageURL } from "@/utils/checkImage";
import { SIZES } from "@/constants/Theme";
export default function CustomDropdown({
  items,
  selectedValue,
  onValueChange,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");
  const bgColor = useThemeColor({}, "bgColor");

  const handleSelect = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: fieldColor }]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="default">
          {items.find((item) => item.value === selectedValue)?.label}
        </ThemedText>
        <Ionicons name="chevron-down" size={24} color={textColor} />
      </TouchableOpacity>

      <Modal
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
                  style={[styles.item, { borderBottomColor: bgColor }]}
                  onPress={() => handleSelect(item)}
                >
                  <Image
                    source={{
                      uri: checkImageURL(item.imageURL)
                        ? item.imageURL
                        : "https://files.oaiusercontent.com/file-DjW5L9b81xAoE1CS5dgfGf?se=2025-01-22T19%3A04%3A19Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D4bc93413-3775-4d04-bb36-d00efe395407.webp&sig=4s4GNu/F9s40L9WCGzcndpvr4bnYlv6ftC7%2BPRitiO0%3D",
                    }}
                    style={styles.itemImage}
                  />
                  <ThemedText type="subtitle" style={{ color: textColor }}>
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: fieldColor }]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText type="default"> Cancel</ThemedText>
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
    borderColor: "#ddd",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
});
