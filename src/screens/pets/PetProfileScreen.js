// PetProfileScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ViewByDateForPet from "./ViewByDateForPet";
import PetParallaxScrollView from "@/components/global/pets/pet_profile/PetParallaxScrollView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/global/ThemedText";
import { fetchPetsFromDb } from "@/database/feedings";
import { fetchFeedingsByPet } from "@/redux/actions";
import PetDetailScreen from "@/components/global/pets/pet_profile/PetDetailScreen";
import PetDataScreen from "@/components/global/pets/pet_profile/PetDataScreen";
// Optionally, import a new component for the Data tab
// import PetDataScreen from "@/components/global/pets/pet_profile/PetDataScreen";

export default function PetProfileScreen({ route, navigation }) {
  const { petId } = route.params;
  const dispatch = useDispatch();
  const [pet, setPet] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Feedings");
  const [hasFetchedFeedings, setHasFetchedFeedings] = useState(false);

  // (Optional) Use feedings state if needed for something else
  const feedings = useSelector((state) => state.feedings);

  const handleEditPress = () => {
    navigation.navigate("EditPetScreen", { petId });
  };

  // Fetch pet details
  const loadPetDetails = async () => {
    try {
      const pets = await fetchPetsFromDb();
      const foundPet = pets.find((p) => p.id === petId);
      setPet(foundPet);
    } catch (error) {
      // console.error("Error loading pet details:", error);
    }
  };

  useEffect(() => {
    loadPetDetails();

    if (!hasFetchedFeedings) {
      dispatch(fetchFeedingsByPet(petId));
      setHasFetchedFeedings(true);
    }
  }, []);

  if (!pet) return <Text>Loading pet details...</Text>;

  return (
    <PetParallaxScrollView
      headerImageSrc={pet?.imageURL}
      headerBackgroundColor={{ light: "#fff", dark: "#000" }}
      petName={pet?.name}
      petBirthdate={pet?.birthDate}
      petMorph={pet?.morph}
      onEditPress={handleEditPress}
    >
      <View style={styles.container}>
        {/* Tabs Header */}
        <View style={styles.tabContainer}>
          <TabButton
            title="Feedings"
            isSelected={selectedTab === "Feedings"}
            onPress={() => setSelectedTab("Feedings")}
          />
          <TabButton
            title="Details"
            isSelected={selectedTab === "Details"}
            onPress={() => setSelectedTab("Details")}
          />
          <TabButton
            title="Data"
            isSelected={selectedTab === "Data"}
            onPress={() => setSelectedTab("Data")}
          />
        </View>

        {/* Tab Content */}
        {selectedTab === "Feedings" ? (
          <ViewByDateForPet petId={petId} pet={pet} />
        ) : selectedTab === "Details" ? (
          <ScrollView>
            <PetDetailScreen
              petName={pet.name}
              petCategory={pet.category}
              petMorph={pet.morph}
              petSpecies={pet.species}
              petBirthdate={pet.birthDate}
              onEditPress={handleEditPress}
            />
          </ScrollView>
        ) : selectedTab === "Data" ? (
          <ScrollView>
            <PetDataScreen pet={pet} />
          </ScrollView>
        ) : null}
      </View>
    </PetParallaxScrollView>
  );
}

// Reusable TabButton component
const TabButton = ({ title, isSelected, onPress }) => {
  const activeColor = useThemeColor({}, "active");
  const fieldColor = useThemeColor({}, "field");
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: isSelected ? activeColor : fieldColor },
      ]}
      onPress={onPress}
    >
      <ThemedText type="default" style={styles.tabButtonText}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 16,
  },
});
