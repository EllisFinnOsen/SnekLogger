import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
} from "react-native";
import AppDataProvider from "@/src/data/providers/AppDataProvider";
import { PersistenceType } from "@/src/data/types";

import { useColorScheme } from "@/src/hooks/useColorScheme";

const colorScheme = useColorScheme();
const [loaded] = useFonts({
  OutfitReg: require("../assets/fonts/Outfit-Regular.ttf"),
  OutfitMed: require("../assets/fonts/Outfit-SemiBold.ttf"),
  OutfitBold: require("../assets/fonts/Outfit-Bold.ttf"),
});

const enabledPersistenceTypes = Platform.select({
  web: [
    PersistenceType.localstorage,
    PersistenceType.indexedDB,
    PersistenceType.sqlite,
  ],
  default: [PersistenceType.localstorage, PersistenceType.sqlite],
});
const Root = () => {
  const [persistenceType, setPersistenceType] = React.useState<PersistenceType>(
    Platform.select({
      web: PersistenceType.indexedDB,
      default: PersistenceType.sqlite,
    })
  );

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppDataProvider persistenceType={persistenceType}>
        <Stack>
          <Text style={styles.title}>
            Persistence type: {persistenceType}, OS: {Platform.OS}
          </Text>
          <View style={styles.buttons}>
            {enabledPersistenceTypes.map((persistenceType) => (
              <Button
                key={persistenceType}
                title={persistenceType}
                onPress={() => setPersistenceType(persistenceType)}
              />
            ))}
          </View>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AppDataProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    width: Platform.select({ web: "50%", default: "100%" }),
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  keyboardView: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    padding: 10,
  },
});

export default Root;
