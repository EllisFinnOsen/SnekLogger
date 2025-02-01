import { StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "./ThemedView";
import { useBottomTabOverflow } from "./TabBarBackground";

export default function SimpleScrollView({ children }) {
  const scrollRef = useAnimatedRef();
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
        testID="simple-scrollview" // <-- Added testID for testing
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    gap: 16,
    overflow: "hidden",
    paddingTop: 64, // This assumes a rem is 16px, so 2rem would be 32px
  },
});
