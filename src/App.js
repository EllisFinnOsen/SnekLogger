import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import store from "@/redux/store";
import StackNavigator from "@/navigation/StackNavigator";
import useColorScheme from "@/hooks/useColorScheme";
import { Provider as PaperProvider } from "react-native-paper";
import { initializeDatabase } from "@/database";
import { fetchPets, fetchUserProfile } from "@/redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
AsyncStorage.removeItem("firstTimeUser");

export default function App() {
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loaded] = useFonts({
    OutfitReg: require("./assets/fonts/Outfit-Regular.ttf"),
    OutfitMed: require("./assets/fonts/Outfit-Medium.ttf"),
    OutfitBold: require("./assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error("Error setting up database:", error);
      }
    };
    setupDatabase();
  }, []);

  useEffect(() => {
    if (dbInitialized) {
      store.dispatch(fetchPets());
      store.dispatch(fetchUserProfile()); // Also fetches first-time flag
    }
  }, [dbInitialized]);

  if (!loaded) {
    return null; // Prevent rendering before fonts load
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StackNavigator />
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
