import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import { useBottomTabOverflow } from "@/components/global/TabBarBackground";
import { checkImageURL } from "@/utils/checkImage";
import useColorScheme from "@/hooks/useColorScheme";

const HEADER_HEIGHT = 250;

export default function PetParallaxScrollView({
  children,
  headerImageSrc,
  headerBackgroundColor,
  petName,
  petBirthdate,
  petMorph,
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
              testID="header-image" // <-- Added testID here
            >
              <View style={styles.overlay}>
                <ThemedText style={styles.petName}>{petName}</ThemedText>
                <ThemedText style={styles.petDetail}>{petBirthdate}</ThemedText>
                <ThemedText style={styles.petDetail}>{petMorph}</ThemedText>
              </View>
            </ImageBackground>
          ) : (
            <ThemedView
              style={[
                styles.headerImage,
                { backgroundColor: headerBackgroundColor[colorScheme] },
              ]}
            >
              <View style={styles.overlay}>
                <ThemedText type="title" style={styles.petName}>
                  {petName}
                </ThemedText>
                <ThemedText style={styles.petDetail}>{petBirthdate}</ThemedText>
                <ThemedText style={styles.petDetail}>{petMorph}</ThemedText>
              </View>
            </ThemedView>
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
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 5,
  },
  petName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  petDetail: {
    fontSize: 16,
    color: "#fff",
  },
});
