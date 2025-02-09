/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#EE4935";
const tintColorDark = "#fff";

export const COLORS = {
  light: {
    text: "#323232",
    subtleText: "#414649",
    field: "#EDECE5",
    fieldAccent: "#E0DED2",
    background: "#fff",
    active: "#ff8C01",
    error: "#C62C2C",
    errorSubtle: "#F4D5D5",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    subtleText: "#C1C3C3",
    field: "#1e2123",
    fieldAccent: "#2D3134",
    background: "#151718",
    active: "#FF8C01",
    error: "#ED2938",
    errorSubtle: "#302425",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const FONT = {
  regular: "OutfitReg",
  medium: "OutfitMed",
  bold: "OutfitBold",
};

export const SIZES = {
  xxSmall: 8,
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};
