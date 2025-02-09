import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { View, useWindowDimensions, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const PaginationElement = ({ length, x }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const activeColor = useThemeColor({}, "active");
  const backgroundColor = useThemeColor({}, "background");
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const width = interpolate(
            x.value,
            [
              (index - 1) * SCREEN_WIDTH,
              index * SCREEN_WIDTH,
              (index + 1) * SCREEN_WIDTH,
            ],
            [10, 20, 10],
            Extrapolate.CLAMP
          );

          return { width };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              animatedDotStyle,
              { backgroundColor: activeColor },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default PaginationElement;
