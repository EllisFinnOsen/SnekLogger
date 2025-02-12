import { Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FONT } from "@/constants/Theme";

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultBold" ? styles.default : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "smDetail" ? styles.smDetail : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT.regular,
  },
  defaultBold: {
    fontSize: 36,
    lineHeight: 24,
    fontFamily: FONT.bold,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONT.medium,
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: FONT.bold,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: FONT.bold,
  },
  smDetail: {
    fontSize: 12,
    fontFamily: FONT.medium,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: FONT.regular,
    opacity: 0.75,
  },
});
