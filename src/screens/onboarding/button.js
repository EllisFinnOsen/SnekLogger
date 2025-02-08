import { ThemedText } from "@/components/global/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button = ({ currentIndex, length, flatListRef, completeOnboarding }) => {
  const activeColor = useThemeColor({}, "active");
  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
  }));

  const handlePress = () => {
    if (currentIndex.value === length - 1) {
      completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex.value + 1 });
    }
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        animatedButtonStyle,
        { backgroundColor: activeColor },
      ]}
      onPress={handlePress}
    >
      <ThemedText type="default" style={styles.text}>
        {currentIndex.value === length - 1 ? "Get Started" : "Next"}
      </ThemedText>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  text: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default Button;
