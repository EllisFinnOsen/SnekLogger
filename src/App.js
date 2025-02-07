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
import {
  fetchFeedingsByPet,
  fetchPets,
  fetchUserProfile,
} from "@/redux/actions";
import { insertOnePet } from "./database/onepet";

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
        //console.error("Error setting up database:", error);
      }
    };

    setupDatabase();
  }, []);

  useEffect(() => {
    if (dbInitialized) {
      store.dispatch(fetchPets());
      store.dispatch(fetchUserProfile());
    }
  }, [dbInitialized]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const pets = state.pets.pets || [];

      if (pets.length > 0) {
        pets.forEach((pet) => store.dispatch(fetchFeedingsByPet(pet.id)));
        unsubscribe(); // Prevent unnecessary re-renders
      }
    });

    return unsubscribe;
  }, []);

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
