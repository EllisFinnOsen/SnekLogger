import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabNavigator from "./TabNavigator";
import OnboardingScreen from "@/screens/onboarding/OnboardingScreen";
import { fetchUserProfile } from "@/redux/actions/userActions";
import AddPetScreen from "@/screens/pets/AddPetScreen";
import PetProfileScreen from "@/screens/pets/PetProfileScreen";
import EditPetScreen from "@/screens/pets/EditPetScreen";
import AddFeedingScreen from "@/screens/feedings/AddFeedingScreen";
import FeedingScreen from "@/screens/feedings/FeedingScreen";
import EditFeedingScreen from "@/screens/feedings/EditFeedingScreen";
import AddGroupScreen from "@/screens/groups/AddGroupScreen";
import GroupScreen from "@/screens/groups/GroupScreen";
import EditGroupScreen from "@/screens/groups/EditGroupScreen";
import { useThemeColor } from "@/hooks/useThemeColor";
import EditUserProfileScreen from "@/screens/user/EditUserProfileScreen";
import FreezerScreen from "@/screens/freezer/FreezerScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
  const dispatch = useDispatch();
  const firstTimeUser = useSelector((state) => state.user.firstTimeUser);
  const headerBackgroundColor = useThemeColor({}, "background");
  const headerTextColor = useThemeColor({}, "text");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      await dispatch(fetchUserProfile()); // Fetch user data
      setLoading(false);
    };
    checkFirstTimeUser();
  }, []);

  if (loading) return null; // Prevent flicker while checking

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={firstTimeUser ? "Onboarding" : "Tabs"}
        screenOptions={{
          headerStyle: { backgroundColor: headerBackgroundColor },
          headerTintColor: headerTextColor,
        }}
      >
        {firstTimeUser ? (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="AddPetScreen"
              component={AddPetScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PetProfileScreen"
              component={PetProfileScreen}
            />
            <Stack.Screen
              name="EditPetScreen"
              component={EditPetScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddGroupScreen"
              component={AddGroupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="GroupScreen"
              component={GroupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditGroupScreen"
              component={EditGroupScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddFeedingScreen"
              component={AddFeedingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FeedingScreen"
              component={FeedingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditFeedingScreen"
              component={EditFeedingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Freezer"
              component={FreezerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditUserProfileScreen"
              component={EditUserProfileScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
