// GroupPickerField.jsx
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  View,
  Image,
} from "react-native";
import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { SIZES } from "@/constants/Theme";

export default function GroupPickerField({ group, setGroup, groups }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");
  const bgColor = useThemeColor({}, "bgColor");

  const handleSelect = (selectedGroup) => {
    setGroup(selectedGroup);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: fieldColor }]}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText type="default">
          {group ? group.name : "Select a group"}
        </ThemedText>
        <Ionicons name="chevron-down" size={24} color={textColor} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { backgroundColor: fieldColor }]}>
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, { borderBottomColor: bgColor }]}
                  onPress={() => handleSelect(item)}
                >
                  {/* If your groups have an image URL, display it; otherwise, you may omit this */}
                  {item.imageURL && (
                    <Image
                      source={{ uri: item.imageURL }}
                      style={styles.itemImage}
                    />
                  )}
                  <ThemedText type="default" style={{ color: textColor }}>
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText type="default">Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    marginVertical: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
    padding: 10,
  },
});
