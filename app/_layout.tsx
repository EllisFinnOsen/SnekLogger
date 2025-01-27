import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "@/store";
import "react-native-reanimated";
import { SQLiteProvider } from "expo-sqlite";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, Text, View } from "react-native";
import { loadDatabase } from "@/assets/db/database";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  
  const [loaded] = useFonts({
    OutfitReg: require("../assets/fonts/Outfit-Regular.ttf"),
    OutfitMed: require("../assets/fonts/Outfit-SemiBold.ttf"),
    OutfitBold: require("../assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await loadDatabase();
        if (loaded) {
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (error) {
        console.error(error);
      }
    }

    prepare();
  }, [loaded]);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SQLiteProvider databaseName="petTracker.db">
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SQLiteProvider>
    </Provider>
  );
}