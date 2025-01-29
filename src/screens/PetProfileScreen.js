import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/global/ThemedView";
import { fetchPetsFromDb } from "@/database";
import { PetParallaxScrollView } from "@/components/global/pets/pet_profile/PetParallaxScrollView";
import { TabButton } from "@/components/global/TabButton";
import { ViewPetProfileFeedings } from "@/components/global/feedings/ViewPetProfileFeedings";
import { useThemeColor } from "@/hooks/useThemeColor";
import { fetchFeedingsByPet } from "@/redux/actions";

export default function PetProfileScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Feedings"); // State to manage selected tab
  const feedings = useSelector((state) => state.feedings);

  // Fetch pet details
  const loadPetDetails = async () => {
    try {
      const pets = await fetchPetsFromDb();
      const foundPet = pets.find((p) => p.id === petId);
      setPet(foundPet);
    } catch (error) {
      console.error("Error loading pet details:", error);
    }
  };

  // Use useFocusEffect to refresh data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadPetDetails();
      dispatch(fetchFeedingsByPet(petId));
    }, [dispatch, petId])
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "Feedings":
        return <ViewPetProfileFeedings petId={petId} />;
      case "Log":
        return <Text>Log Content</Text>;
      case "Charts":
        return <Text>Charts Content</Text>;
      case "Profile":
        return (
          <>
            <Text style={styles.title}>{pet.name}’s Profile</Text>
            <Text style={styles.detail}>ID: {pet.id}</Text>
          </>
        );
      default:
        return null;
    }
  };

  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({}, "field");
  const subtleTextColor = useThemeColor({}, "subtleText");
  const activeColor = useThemeColor({}, "active");
  const bgColor = useThemeColor({}, "background");

  return (
    <PetParallaxScrollView
      headerImageSrc={pet?.imageURL}
      headerBackgroundColor={{ light: "#fff", dark: "#000" }}
    >
      <ThemedView style={styles.container}>
        {pet ? (
          <>
            <ScrollView horizontal style={styles.tabContainer}>
              {["Feedings", "Log", "Charts", "Profile"].map((tab) => (
                <TabButton
                  key={tab}
                  name={tab}
                  activeTab={selectedTab}
                  onHandleSearchType={() => setSelectedTab(tab)}
                  activeColor={activeColor}
                  subtleTextColor={subtleTextColor}
                  iconColor={iconColor}
                  textColor={textColor}
                  bgColor={bgColor}
                />
              ))}
            </ScrollView>
            <View style={styles.contentContainer}>{renderContent()}</View>
          </>
        ) : (
          <Text>Loading pet details...</Text>
        )}
      </ThemedView>
    </PetParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 16,
  },
});
