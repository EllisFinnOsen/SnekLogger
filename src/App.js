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
import SubscriptionScreen from "./screens/onboarding/SubscriptionScreen";
import Purchases from "react-native-purchases";
import CustomStatusBar from "./hooks/CustomStatusBar";
import { resetDatabase } from "./database/reset";
import { insertRobustMockData } from "./database/mockData";

//AsyncStorage.removeItem("firstTimeUser");

export default function App() {
  const REVENUECAT_API_KEY = "your_revenuecat_api_key";
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [trialActive, setTrialActive] = useState(true);
  const TRIAL_DAYS = 30; // Number of days in trial

  const [loaded] = useFonts({
    OutfitReg: require("./assets/fonts/Outfit-Regular.ttf"),
    OutfitMed: require("./assets/fonts/Outfit-Medium.ttf"),
    OutfitBold: require("./assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await resetDatabase();
        await initializeDatabase();
        await insertRobustMockData();
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
      store.dispatch(fetchUserProfile()); // Fetch user profile info
    }
  }, [dbInitialized]);

  useEffect(() => {
    const checkTrialPeriod = async () => {
      try {
        const storedStartDate = await AsyncStorage.getItem("trialStartDate");

        if (!storedStartDate) {
          const startDate = new Date().toISOString();
          await AsyncStorage.setItem("trialStartDate", startDate);
          setTrialActive(true);
        } else {
          const startDate = new Date(storedStartDate);
          const currentDate = new Date();
          const differenceInDays = Math.floor(
            (currentDate - startDate) / (1000 * 60 * 60 * 24)
          );

          if (differenceInDays < TRIAL_DAYS) {
            setTrialActive(true);
          } else {
            setTrialActive(false);
          }
        }
      } catch (error) {
        console.error("Error checking trial period:", error);
      }
    };

    checkTrialPeriod();
  }, []);

  if (!loaded) {
    return null; // Prevent rendering before fonts load
  }

  if (!trialActive) {
    return <SubscriptionScreen />; // Redirect to payment screen if trial expired
  }

  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <CustomStatusBar />
          <StackNavigator />
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
