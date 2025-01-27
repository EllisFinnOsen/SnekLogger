import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SIZES } from "@/constants/Theme";
import { FeedingTypeDropdown } from '@/components/FeedingTypesDropdown';
import { useState } from "react";

type DetailCellProps = {
  icon: string;
  label: string;
  value: string;
  isEditing?: boolean;
  onPress?: () => void;
  fieldColor: string;
  iconColor: string;
  isDropdown?: boolean;
  onValueChange?: (value: string) => void;
  customContent?: React.ReactNode;
  dropdownComponent?: React.ReactNode;
  isPetImage?: boolean;
};

export const DetailCell = ({
  icon,
  label,
  value,
  isEditing,
  onPress,
  fieldColor,
  iconColor,
  isDropdown,
  onValueChange,
  customContent,
  dropdownComponent,
  isPetImage,
}: DetailCellProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <View style={[styles.cell, { borderBottomColor: fieldColor }]}>
      {isPetImage ? (
        <TouchableOpacity 
          style={styles.petImageContainer}
          onPress={isEditing ? onPress : undefined}
        >
          <View style={styles.petImageSection}>
            {customContent}
          </View>
          {isEditing && (
            <IconSymbol size={18} name="edit" color={iconColor} />
          )}
          {dropdownComponent}
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.category}>
            <IconSymbol size={18} name={icon} color={iconColor} />
            <ThemedText type="subtitle">{label}</ThemedText>
          </View>
          {customContent ? (
            isEditing ? (
              <>
                <TouchableOpacity
                  style={styles.editableWrap}
                  onPress={() => setIsDropdownVisible(true)}
                >
                  {customContent}
                  <IconSymbol size={18} name="edit" color={iconColor} />
                </TouchableOpacity>
                {dropdownComponent}
              </>
            ) : (
              customContent
            )
          ) : (
            isEditing && isDropdown ? (
              <>
                <TouchableOpacity
                  style={styles.editableWrap}
                  onPress={() => setIsDropdownVisible(true)}
                >
                  <ThemedText
                    style={[styles.editablefield, { backgroundColor: fieldColor }]}
                    type="default"
                  >
                    {value}
                  </ThemedText>
                  <IconSymbol size={18} name="edit" color={iconColor} />
                </TouchableOpacity>
                <FeedingTypeDropdown
                  value={value}
                  onSelect={(newValue) => onValueChange?.(newValue)}
                  isVisible={isDropdownVisible}
                  onClose={() => setIsDropdownVisible(false)}
                />
              </>
            ) : (
              <ThemedText type="default">{value}</ThemedText>
            )
          )}
        </>
      )}
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
  editableWrap: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  petImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  petImageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petImageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});