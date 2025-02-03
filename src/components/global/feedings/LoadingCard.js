import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SIZES } from "@/constants/Theme"; // Importing SIZES for consistent spacing

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function LoadingCard() {
  const translateX = useRef(new Animated.Value(-200)).current;

  // Retrieve theme colors
  const fieldColor = useThemeColor({}, "field");
  const fieldAccent = useThemeColor({}, "fieldAccent");
  const iconColor = useThemeColor({}, "icon");
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 200,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [translateX]);

  return (
    <View
      style={[
        styles.wrap, // Apply same styles as FeedingLogCard
        {
          backgroundColor, // Match FeedingLogCard's background
          borderColor: iconColor, // Match FeedingLogCard's border color
        },
      ]}
    >
      <View style={styles.placeholder}>
        <AnimatedLinearGradient
          colors={[backgroundColor, fieldAccent, backgroundColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { transform: [{ translateX }] }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: SIZES.xSmall, // Same as FeedingLogCard
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: SIZES.xxSmall,
    borderWidth: 2,
    alignContent: "center",
    height: 70, // Match FeedingLogCard's estimated height
    overflow: "hidden", // Ensure gradient stays within bounds
  },
  placeholder: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    width: 300, // Ensures smooth animation across card
  },
});
