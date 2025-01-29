import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/global/ThemedView";
import { useBottomTabOverflow } from "@/components/global/TabBarBackground";
import { checkImageURL } from "@/utils/checkImage";
import useColorScheme from "@/hooks/useColorScheme";

const HEADER_HEIGHT = 250;

export default function PetParallaxScrollView({
  children,
  headerImageSrc,
  headerBackgroundColor,
}) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT]
          ),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: bottom }}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          {checkImageURL(headerImageSrc) ? (
            <ImageBackground
              source={{ uri: headerImageSrc }}
              style={styles.headerImage}
            />
          ) : (
            <ThemedView
              style={[
                styles.headerImage,
                { backgroundColor: headerBackgroundColor[colorScheme] },
              ]}
            />
          )}
        </Animated.View>
        {children}
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    overflow: "hidden",
  },
  headerImage: {
    height: "100%",
    width: "100%",
  },
});
