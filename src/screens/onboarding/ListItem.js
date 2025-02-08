import { FONT } from "@/constants/Theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const ListItem = ({ item, index, x }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const animatedImageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View
      style={[
        styles.itemContainer,
        { width: SCREEN_WIDTH, backgroundColor: backgroundColor },
      ]}
    >
      <Animated.Image
        source={item.image}
        style={[styles.image, animatedImageStyle]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[styles.text, { fontFamily: FONT.bold, color: textColor }]}
      >
        {item.text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: 300, height: 300 },
  text: {
    fontSize: 24,
    fontFamily: FONT.bold,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 32,
  },
});

export default React.memo(ListItem);
