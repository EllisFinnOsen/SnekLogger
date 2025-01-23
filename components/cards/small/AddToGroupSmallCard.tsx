import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, SIZES } from "@/constants/Theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface AddToGroupSmallCardProps {
  onPress: () => void;
}

const AddToGroupSmallCard = ({ onPress }: AddToGroupSmallCardProps) => {
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleColor = useThemeColor({}, "subtleText");
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={[styles.container, { backgroundColor: fieldColor }]}>
        <View style={styles.iconContainer}>
          <IconSymbol size={36} name="plus.square" color={iconColor} />
        </View>
        <ThemedText
          type="subtitle"
          style={[styles.addToGroupText, { color: subtleColor }]}
        >
          Add pet
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default AddToGroupSmallCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    borderRadius: SIZES.medium,
    width: 160,
    height: 100,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.xSmall,
  },
  plusIcon: {
    width: "100%",
    height: "100%",
  },
  addToGroupText: {
    fontSize: SIZES.small,
  },
});
