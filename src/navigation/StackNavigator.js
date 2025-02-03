import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import AnotherScreen from "@/screens/AnotherScreen"; // Import any additional screens that are not part of the tabs
import PetProfileScreen from "@/screens/pets/PetProfileScreen";
import EditFeedingScreen from "@/screens/feedings/EditFeedingScreen";
import GroupScreen from "@/screens/groups/GroupScreen";
import AddPetScreen from "@/screens/pets/AddPetScreen";
import EditPetScreen from "@/screens/pets/EditPetScreen";
import { useThemeColor } from "@/hooks/useThemeColor";
import AddFeedingScreen from "@/screens/feedings/AddFeedingScreen";
import AddGroupScreen from "@/screens/groups/AddGroupScreen";
import EditGroupScreen from "@/screens/groups/EditGroupScreen";

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
        <Stack.Screen name="PetProfileScreen" component={PetProfileScreen} />
        <Stack.Screen
          name="EditFeeding"
          component={EditFeedingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupScreen"
          component={GroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPetScreen"
          component={AddPetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddGroupScreen"
          component={AddGroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditGroupScreen"
          component={EditGroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPetScreen"
          component={EditPetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddFeedingScreen"
          component={AddFeedingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
