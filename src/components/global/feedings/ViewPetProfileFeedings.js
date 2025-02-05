// ViewPetProfileFeedings.js
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import { selectFeedingsByPet } from "@/redux/selectors/selectors";

export default function ViewPetProfileFeedings({ petId }) {
  // Filter feedings using the selector
  const petFeedings = useSelector((state) => selectFeedingsByPet(state, petId));
  return (
    <View>
      <FeedingsList
        feedings={petFeedings}
        title="Feedings"
        showAllLink={true}
        noFeedingsText="No feedings available for this pet"
      />
    </View>
  );
}
