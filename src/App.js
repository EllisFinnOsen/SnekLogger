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
import { insertMockData } from "@/database/mockData";
import { resetDatabase } from "@/database/reset";
import { fetchPets, fetchUserProfile } from "@/redux/actions";

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
        //await resetDatabase();
        await initializeDatabase();
        //await insertMockData();
        setDbInitialized(true); // Mark database as ready
      } catch (error) {
        console.error("Error setting up database:", error);
      }
    };

    setupDatabase();
  }, []);

  // Fetch pets and user profile after database is ready
  useEffect(() => {
    if (dbInitialized) {
      store.dispatch(fetchPets());
      store.dispatch(fetchUserProfile());
    }
  }, [dbInitialized]);

  if (!loaded) {
    return null;
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
