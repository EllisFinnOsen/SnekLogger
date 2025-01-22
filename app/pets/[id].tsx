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

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import useFetch from "@/hooks/useFetch";
import { Colors, SIZES } from "@/constants/Theme";
import { Stack } from "expo-router";
import Feedings from "@/components/petProfiles/feedings/Feedings";
import Log from "@/components/petProfiles/log/Log";
import PetProfile from "@/components/petProfiles/petprofile/PetProfile";
import Tabs from "@/components/petProfiles/tabs/Tabs";
import { ExternalLink } from "@/components/ExternalLink";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";

const tabs = ["Feedings", "Log", "Responsibilities"];

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
        return <Feedings title="Feedings" />;

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
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">History</ThemedText>
        </ThemedView>
        <ThemedText>
          This app includes example code to help you get started.
        </ThemedText>
        <Collapsible title="File-based routing">
          <ThemedText>
            This app has two screens:{" "}
            <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
            and{" "}
            <ThemedText type="defaultSemiBold">
              app/(tabs)/explore.tsx
            </ThemedText>
          </ThemedText>
          <ThemedText>
            The layout file in{" "}
            <ThemedText type="defaultSemiBold">
              app/(tabs)/_layout.tsx
            </ThemedText>{" "}
            sets up the tab navigator.
          </ThemedText>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <ThemedText type="link">Learn more</ThemedText>
          </ExternalLink>
        </Collapsible>
      </ParallaxScrollView>
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
