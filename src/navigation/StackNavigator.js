import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import AnotherScreen from "../screens/AnotherScreen"; // Import any additional screens that are not part of the tabs
import PetProfileScreen from "../screens/PetProfileScreen";
import EditFeedingScreen from "../screens/EditFeedingScreen";
import { useThemeColor } from "../hooks/useThemeColor";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const headerBackgroundColor = useThemeColor({}, "background");
  const headerTextColor = useThemeColor({}, "text");

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerStyle: { backgroundColor: headerBackgroundColor },
          headerTintColor: headerTextColor,
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="PetProfile" component={PetProfileScreen} />
        <Stack.Screen name="EditFeeding" component={EditFeedingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
