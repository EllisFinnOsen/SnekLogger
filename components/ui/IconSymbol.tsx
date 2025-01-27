// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { OpaqueColorValue, StyleProp, ViewStyle } from "react-native";

// Add your SFSymbol to MaterialIcons mappings here.
// See MaterialIcons names here: https://icons.expo.fyi/MaterialIcons
// See SF Symbols in the SF Symbols app (macOS).

const MAPPING = {
  // Example Mappings
  "house.fill": "home",
  "paperplane.fill": "send",
  "magnifyingglass.circle": "search",

  // "calendar-month" is from MaterialCommunityIcons,
  // so let's swap it for something valid in MaterialIcons, like "calendar-today":
  "calendar.circle.fill": "calendar-today",

  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "folder.fill": "folder",
  "plus.square": "add",
  "smallcircle.fill.circle": "radio-button-unchecked",

  // Updated to "access-time" (with a dash) instead of "access_time":
  clock: "access-time",

  // NEW rodent icon (try pest_control_rodent):
  // If you see an error, your version of MaterialIcons may not have it.
  food: "pest-control-rodent",
  "edit": "edit"
} as const;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS,
 * and MaterialIcons on Android and web. This ensures
 * a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual
 * mapping to MaterialIcons (above).
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
