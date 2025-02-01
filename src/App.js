import React from "react";
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

export default function App() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    OutfitReg: require("./assets/fonts/Outfit-Regular.ttf"),
    OutfitMed: require("./assets/fonts/Outfit-Medium.ttf"),
    OutfitBold: require("./assets/fonts/Outfit-Bold.ttf"),
  });
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
