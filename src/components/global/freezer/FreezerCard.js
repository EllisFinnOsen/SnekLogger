import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { updateFreezerItem, deleteFreezerItem } from "@/redux/actions";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import EditFreezerModal from "@/components/freezer/EditFreezerModal";

const FreezerCard = ({ prey }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const textColor = useThemeColor({}, "text");
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const iconColor = useThemeColor({}, "icon");

  // ✅ Ensure correct data types for rendering
  const preyTypeText = String(prey?.preyType ?? "Unknown");
  const quantityText = Number(prey?.quantity ?? 0);
  const weightText =
    prey?.weight !== undefined && prey?.weight !== null
      ? `${prey.weight} ${prey.weightType ?? ""}`
      : "N/A";

  return (
    <View
      style={{
        padding: 15,
        marginVertical: 5,
        backgroundColor: fieldColor,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons name="rodent" size={36} color={iconColor} />
        <View style={{ flexDirection: "column", paddingLeft: 15 }}>
          <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
            {`${preyTypeText}: ${quantityText}`}
          </ThemedText>
          <ThemedText>Weight: ~{weightText}</ThemedText>
        </View>
      </View>

      {/* Manage Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: fieldColor,
          borderColor: fieldAccent,
          borderWidth: 1,
          padding: 8,
          borderRadius: 5,
          marginTop: 5,
        }}
      >
        <ThemedText style={{ color: textColor, textAlign: "center" }}>
          Manage
        </ThemedText>
      </TouchableOpacity>

      {/* Edit Modal */}
      <EditFreezerModal
        visible={modalVisible}
        prey={prey}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default FreezerCard;
