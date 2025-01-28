import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import CollectionScreen from "../screens/collection/CollectionScreen";
import FreezerScreen from "../screens/freezer/FreezerScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Ionicons } from "@expo/vector-icons"; // Or any other icon library

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
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
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Freezer" component={FreezerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}