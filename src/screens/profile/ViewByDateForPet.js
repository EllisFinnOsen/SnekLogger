// ViewByDateForPet.js
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { startOfToday, addDays, isSameDay, isAfter } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function ViewByDateForPet({ petId }) {
  // Log the incoming petId
  console.log("ViewByDateForPet received petId:", petId);

  // Get all feedings from Redux and filter for this pet
  const allFeedings = useSelector((state) => state.feedings);
  const petFeedings = allFeedings.filter(
    (feeding) => Number(feeding.petId) === Number(petId)
  );
  console.log("Filtered petFeedings count:", petFeedings.length);

  // Optionally, if you only want incomplete feedings for the first three sections:
  const incompleteFeedings = petFeedings.filter(
    (feeding) => feeding.complete === 0
  );

  // Define reference dates (using local time)
  const today = startOfToday();
  const tomorrow = addDays(today, 1);

  // Helper: Parse the feeding's date (ignoring its time) as a local Date.
  const parseFeedingDateForDay = (feeding) =>
    new Date(`${feeding.feedingDate}T00:00:00`);

  // Late Feedings: feedings scheduled before today.
  const lateFeedings = incompleteFeedings.filter((feeding) => {
    const d = parseFeedingDateForDay(feeding);
    return d < today;
  });

  // Today's Feedings: feedings scheduled for today.
  const todaysFeedings = incompleteFeedings.filter((feeding) =>
    isSameDay(parseFeedingDateForDay(feeding), today)
  );

  // Upcoming Feedings: feedings scheduled after today (tomorrow or later).
  const upcomingFeedings = incompleteFeedings.filter((feeding) => {
    const d = parseFeedingDateForDay(feeding);
    return isAfter(d, today);
  });

  // Past Complete Feedings: feedings that are complete and scheduled before today.
  // We sort these from newest to oldest.
  const pastCompleteFeedings = petFeedings
    .filter((feeding) => {
      const d = parseFeedingDateForDay(feeding);
      return feeding.complete === 1;
    })
    .sort((a, b) => parseFeedingDateForDay(b) - parseFeedingDateForDay(a));

  // Debug logs (optional)
  console.log("Late Feedings:", lateFeedings.length);
  console.log("Today's Feedings:", todaysFeedings.length);
  console.log("Upcoming Feedings:", upcomingFeedings.length);
  console.log("Past Complete Feedings:", pastCompleteFeedings.length);

  return (
    <View>
      {lateFeedings.length > 0 && (
        <FeedingsList
          feedings={lateFeedings}
          title="Late Feedings"
          showAllLink={false}
          noFeedingsText="No late feedings available"
        />
      )}

      {todaysFeedings.length > 0 && (
        <FeedingsList
          feedings={todaysFeedings}
          title="Today's Feedings"
          showAllLink={false}
          noFeedingsText="No feedings scheduled for today"
        />
      )}

      {upcomingFeedings.length > 0 && (
        <FeedingsList
          feedings={upcomingFeedings}
          title="Upcoming Feedings"
          showAllLink={true}
          noFeedingsText="No upcoming feedings available"
        />
      )}

      {pastCompleteFeedings.length > 0 && (
        <FeedingsList
          feedings={pastCompleteFeedings}
          title="Past Complete Feedings"
          showAllLink={false}
          noFeedingsText="No past complete feedings available"
        />
      )}
    </View>
  );
}
