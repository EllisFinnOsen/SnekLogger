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
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { setPets } from "@/redux/slices/petsSlice";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, Text, View } from "react-native";
import { loadDatabase } from "@/assets/db/database";
export default function RootLayout() {
  const [dbLoaded, setDbLoaded] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((error) => console.error(error));
  }, []);

  if (!dbLoaded) {
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