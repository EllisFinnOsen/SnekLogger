import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/global/ThemedView";
import { ThemedText } from "@/components/global/ThemedText";
import PrimaryPetCard from "@/components/global/pets/PrimaryPetCard";
import AddPetCard from "@/components/global/pets/AddPetCard";
import AddPetPickerModal from "./add_pet/AddPetPickerModal";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PetList({
  pets = [],
  title,
  showAllLink = false,
  noPetsText = "No pets available",
  onShowAllPress,
  groupId, // if provided, indicates this pet list belongs to a group
  loading = false,
}) {
  const iconColor = useThemeColor({}, "icon");
  const navigation = useNavigation();
  const [pickerVisible, setPickerVisible] = useState(false);

  // Determine what happens when the "Show all" link is pressed.
  const handleShowAllPress =
    onShowAllPress ||
    (groupId ? () => navigation.navigate("GroupScreen", { groupId }) : null);

  // Handler for tapping the add button (plus icon or add card).
  const handleAddCardPress = () => {
    if (!groupId) {
      navigation.navigate("AddPetScreen");
    } else {
      setPickerVisible(true);
    }
  };

  // When an option is selected from the picker.
  const handleSelectOption = (option) => {
    setPickerVisible(false);
    if (option === "new") {
      navigation.navigate("AddPetScreen", { groupId });
    }
    // The modal Save button for "existing" handles linking.
  };

  // If loading, show loading indicator.
  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
        <ThemedText type="default" style={styles.loadingText}>
          Loading...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      {/* Header */}
      {(title || showAllLink) && (
        <View style={styles.headerContainer}>
          <View style={styles.leftHeader}>
            <ThemedText type="subtitle" style={styles.headerTitle}>
              {title}
            </ThemedText>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={handleAddCardPress}
            >
              <Ionicons name="add-circle" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
          {showAllLink && handleShowAllPress && (
            <TouchableOpacity onPress={handleShowAllPress}>
              <ThemedText type="link">Show all</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {pets.length === 0 ? (
        // Empty state view: add card left aligned (with no left padding)
        <View style={styles.emptyStateContainer}>
          <View style={styles.addCardContainer}>
            <TouchableOpacity onPress={handleAddCardPress}>
              <AddPetCard />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // When pets exist, display pet list along with the add pet card.
        <ScrollView horizontal style={styles.petList}>
          {pets.map((pet) => (
            <View key={pet.id} style={styles.cardContainer}>
              <PrimaryPetCard pet={pet} />
            </View>
          ))}
          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={handleAddCardPress}>
              <AddPetCard />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {pickerVisible && (
        <AddPetPickerModal
          visible={pickerVisible}
          onSelectOption={handleSelectOption}
          groupId={groupId}
          onClose={() => setPickerVisible(false)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
  },
  plusButton: {
    marginLeft: 8,
  },
  petList: {
    flexDirection: "row",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
  },
  // Adjust empty state container to remove left padding
  emptyStateContainer: {
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 0, // Remove left padding so the add card lines up at the far left
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  // Use cardContainer for spacing between cards in the scroll view
  cardContainer: {
    margin: 0,
    // Optionally, you can add a right margin here for spacing between cards.
    // When there's only one card in empty state, its container won't apply margin if it’s not used.
  },
  // If desired, you can leave addCardContainer as is, or remove margin/padding as needed.
  addCardContainer: {
    alignItems: "flex-start",
  },
});
