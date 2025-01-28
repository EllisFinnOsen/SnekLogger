import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import PetProfileScreen from "../screens/PetProfileScreen";
import EditFeedingScreen from "../screens/EditFeedingScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PetProfile" component={PetProfileScreen} />
        <Stack.Screen name="EditFeeding" component={EditFeedingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
