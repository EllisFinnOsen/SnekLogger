import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SIZES } from "@/constants/Theme";

type ToggleDetailCellProps = {
  icon: string;
  label: string;
  value: string;
  isEditing: boolean;
  onToggle: () => void;
  fieldColor: string;
  iconColor: string;
};

export const ToggleDetailCell = ({
  icon,
  label,
  value,
  isEditing,
  onToggle,
  fieldColor,
  iconColor,
}: ToggleDetailCellProps) => {
  return (
    <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
      <View style={styles.category}>
        <IconSymbol size={18} name={icon} color={iconColor} />
        <ThemedText type="subtitle">{label}</ThemedText>
      </View>
      <TouchableOpacity 
        onPress={isEditing ? onToggle : undefined}
        style={styles.valueContainer}
      >
        <ThemedText type="default">{value}</ThemedText>
        {isEditing && <IconSymbol size={18} name="edit" color={iconColor} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 14,
    padding: 8,
    gap: 8,
    borderBottomEndRadius: 6,
    borderBottomWidth: 1,
  },
  category: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  editablefield: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.xSmall,
  },
  valueContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});