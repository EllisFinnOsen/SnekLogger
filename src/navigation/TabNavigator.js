import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import CollectionScreen from "../screens/collection/CollectionScreen";
import FreezerScreen from "../screens/freezer/FreezerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Ionicons } from "@expo/vector-icons"; // Or any other icon library
import { useThemeColor } from "../hooks/useThemeColor";
import { COLORS } from "../constants/Theme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const backgroundColor = useThemeColor({}, "background");
  const activeTintColor = useThemeColor({}, "tabIconSelected");
  const inactiveTintColor = useThemeColor({}, "tabIconDefault");
  const headerBackgroundColor = useThemeColor({}, "background");
  const headerTextColor = useThemeColor({}, "text");

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Collection") {
            iconName = "paw";
          } else if (route.name === "Freezer") {
            iconName = "nutrition";
          } else if (route.name === "Profile") {
            iconName = "ellipsis-horizontal";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: { backgroundColor },
        headerStyle: { backgroundColor: headerBackgroundColor },
        headerTintColor: headerTextColor,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Collection"
        component={CollectionScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Freezer"
        component={FreezerScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
