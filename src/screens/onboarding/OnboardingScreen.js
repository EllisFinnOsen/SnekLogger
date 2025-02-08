import React, { useCallback, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setFirstTimeUser } from "@/redux/actions/userActions";
import ListItem from "@/screens/onboarding/ListItem";
import PaginationElement from "@/screens/onboarding/PaginationElement";
import Button from "@/screens/onboarding/button";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const pages = [
  {
    text: "Welcome to VorTrack!",
    image: require("@/assets/onboarding1.png"),
  },
  {
    text: "Manage your pet's feedings with ease.",
    image: require("@/assets/onboarding2.png"),
  },
  {
    text: "Track inventory and feeding history.",
    image: require("@/assets/onboarding3.png"),
  },
];

export default function OnboardingScreen({ navigation }) {
  const dispatch = useDispatch();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef();

  // Handle when user finishes onboarding
  const completeOnboarding = async () => {
    await AsyncStorage.setItem("firstTimeUser", "false");
    dispatch(setFirstTimeUser(false));

    navigation.navigate("Home");
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    flatListIndex.value = viewableItems[0]?.index ?? 0;
  }, []);

  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        pagingEnabled
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={({ item, index }) => (
          <ListItem item={item} index={index} x={x} />
        )}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        scrollEventThrottle={16}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
          completeOnboarding={completeOnboarding}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
