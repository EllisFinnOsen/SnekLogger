import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";
import { SIZES, FONT } from "../../constants/Theme";

// Dynamic style functions
const buttonStyle = (
  name,
  activeTab,
  activeColor,
  subtleTextColor,
  iconColor
) => ({
  paddingVertical: SIZES.small,
  paddingHorizontal: SIZES.large,
  backgroundColor: name === activeTab ? activeColor : subtleTextColor,
  borderRadius: SIZES.xSmall,
  marginLeft: 2,
  shadowColor: iconColor,
});

const buttonTextStyle = (name, activeTab, textColor, bgColor) => ({
  fontFamily: FONT.medium,
  fontSize: SIZES.medium,
  color: name === activeTab ? textColor : bgColor,
});

export default function TabButton({
  name,
  activeTab,
  onHandleSearchType,
  activeColor,
  subtleTextColor,
  iconColor,
  textColor,
  bgColor,
}) {
  return (
    <TouchableOpacity
      style={buttonStyle(
        name,
        activeTab,
        activeColor,
        subtleTextColor,
        iconColor
      )}
      onPress={onHandleSearchType}
    >
      <Text style={buttonTextStyle(name, activeTab, textColor, bgColor)}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}
