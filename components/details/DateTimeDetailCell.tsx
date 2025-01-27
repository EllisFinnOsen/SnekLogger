import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SIZES } from "@/constants/Theme";

type DateTimeDetailCellProps = {
  icon: string;
  label: string;
  value: string;
  isEditing: boolean;
  onPress: () => void;
  fieldColor: string;
  iconColor: string;
};

export const DateTimeDetailCell = ({
  icon,
  label,
  value,
  isEditing,
  onPress,
  fieldColor,
  iconColor,
}: DateTimeDetailCellProps) => {
  return (
    <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
      <View style={styles.category}>
        <IconSymbol size={18} name={icon} color={iconColor} />
        <ThemedText type="subtitle">{label}</ThemedText>
      </View>
      <TouchableOpacity 
        onPress={isEditing ? onPress : undefined}
        style={styles.valueContainer}
      >
        <ThemedText 
          style={[styles.editablefield, isEditing && { backgroundColor: fieldColor }]} 
          type="default"
        >
          {value}
        </ThemedText>
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