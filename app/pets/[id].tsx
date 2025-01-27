import { useRouter, useGlobalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSQLiteContext } from "expo-sqlite";
import { fetchPets } from "@/store/petsSlice";

import Feedings from "@/components/petProfiles/feedings/Feedings";
import Log from "@/components/petProfiles/log/Log";
import PetProfile from "@/components/petProfiles/petprofile/PetProfile";
import Tabs from "@/components/petProfiles/tabs/Tabs";
import PetParallaxScrollView from "@/components/PetParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";

const tabs = ["Feedings", "Log", "Profile"];

const AnimalDetails = () => {
  const params = useGlobalSearchParams();
  const { id } = params;
  const dispatch = useDispatch();
  const db = useSQLiteContext();

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  // Redux selectors
  const pet = useSelector((state: RootState) => 
    state.pets.list.find(p => p.id === Number(id))
  );
  const status = useSelector((state: RootState) => state.pets.status);
  const error = useSelector((state: RootState) => state.pets.error);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchPets(db) as any);
      await dispatch(fetchAllFeedings(db) as any);
    };
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchPets(db) as any);
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Feedings":
        return <Feedings petId={id} title="Feedings" />;
      case "Log":
        return <Log title="Log" />;
      case "Profile":
        return <PetProfile title="Profile" />;
      default:
        return null;
    }
  };

  if (status === "loading") {
    return <ActivityIndicator size="large" />;
  }

  if (status === "failed" || !pet) {
    return <ThemedText type="default">No pet found: {error}</ThemedText>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: pet?.name || "Loading...",
        }}
      />
      <PetParallaxScrollView
        headerImageSrc={pet?.imageURL || ""}
        headerBackgroundColor={{ light: "#fff", dark: "#000" }}
      >
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        {displayTabContent()}
      </PetParallaxScrollView>
    </>
  );
};

export default AnimalDetails;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
