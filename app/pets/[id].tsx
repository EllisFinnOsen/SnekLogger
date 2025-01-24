import { useRouter, useGlobalSearchParams } from "expo-router";
import { useState, useEffect, useCallback, React } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import useFetch from "@/src/hooks/useFetch";
import { Stack } from "expo-router";
import Feedings from "@/components/petProfiles/feedings/Feedings";
import Log from "@/components/petProfiles/log/Log";
import PetProfile from "@/components/petProfiles/petprofile/PetProfile";
import Tabs from "@/components/petProfiles/tabs/Tabs";
import PetParallaxScrollView from "@/components/PetParallaxScrollView";

const tabs = ["Feedings", "Log", "Profile"];

const AnimalDetails = () => {
  const params = useGlobalSearchParams();
  const { id } = params;
  const { data, isLoading, error, refetch } = useFetch(
    `SELECT * FROM pets WHERE id=${id}`
  );
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
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

  return (
    <>
      <Stack.Screen
        options={{
          title:
            isLoading || !data || data.length === 0
              ? "Loading..."
              : data[0]?.name,
        }}
      />
      <PetParallaxScrollView
        headerImageSrc={data && data[0]?.imageURL ? data[0].imageURL : ""}
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
