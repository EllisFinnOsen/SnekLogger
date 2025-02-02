// PetFeedingsList.js
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import { selectFeedingsByPet } from "@/redux/selectors";

export default function PetFeedingsList({ petId }) {
  // Ensure petId is treated as a number, or let the selector convert it.
  const petFeedings = useSelector((state) => selectFeedingsByPet(state, petId));

  console.log("Pet Feedings for petId", petId, ":", petFeedings);

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
