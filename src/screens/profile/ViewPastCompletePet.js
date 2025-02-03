// ViewPastCompletePet.js
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { startOfToday } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
// Optionally, if you want to log the device's timezone:
import * as Localization from "expo-localization";

export default function ViewPastCompletePet({ petId }) {
  // Log the device's time zone for debugging (if needed)
  //console.log("Device Time Zone:", Localization.timezone);

  // Retrieve all feedings from Redux
  const allFeedings = useSelector((state) => state.feedings);

  // Get today's date at local midnight
  const today = startOfToday();

  // Filter for feedings belonging to this pet, that are complete and are scheduled before today.
  const pastCompleteFeedings = allFeedings
    .filter((feeding) => {
      // Ensure petId comparison is consistent (convert to Number)
      if (Number(feeding.petId) !== Number(petId)) return false;
      // Only include complete feedings.
      if (feeding.complete !== 1) return false;
      // Parse the feeding date at midnight so we compare days only.
      const feedingDay = new Date(`${feeding.feedingDate}T00:00:00`);
      return feedingDay < today;
    })
    // Sort feedings from newest to oldest (descending order)
    .sort((a, b) => {
      const aTime = new Date(`${a.feedingDate}T${a.feedingTime}`).getTime();
      const bTime = new Date(`${b.feedingDate}T${b.feedingTime}`).getTime();
      return bTime - aTime;
    });

  //console.log(
    "Past complete feedings for pet",
    petId,
    ":",
    pastCompleteFeedings
  );

  return (
    <View>
      <FeedingsList
        animateOnChange={true}
        isVisible={true}
        feedings={pastCompleteFeedings}
        title="Complete Feedings"
        showAllLink={true}
        noFeedingsText="No past or complete feedings available"
      />
    </View>
  );
}
