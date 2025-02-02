// FeedingsByDaySections.js
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { startOfToday, addDays, isSameDay, isAfter, format } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function FeedingsByDaySections() {
  // Get all feedings from Redux. We assume these include both past and future.
  // Then filter for incomplete feedings.
  const allFeedings = useSelector((state) => state.feedings);
  const incompleteFeedings = allFeedings.filter(
    (feeding) => feeding.complete === 0
  );
  console.log("All incomplete feedings:", incompleteFeedings);

  // Define reference date for today (at local midnight).
  const today = startOfToday();
  console.log("Today (startOfToday):", format(today, "yyyy-MM-dd HH:mm:ss"));

  // Helper: parse a feeding's date as a local date at midnight.
  // This ensures we compare only the day, ignoring the time.
  const parseFeedingDateForDay = (feeding) =>
    new Date(`${feeding.feedingDate}T00:00:00`);

  // Late Feedings: Feedings scheduled before today.
  const lateFeedings = incompleteFeedings.filter((feeding) => {
    const d = parseFeedingDateForDay(feeding);
    return d < today;
  });

  // Today's Feedings: Feedings scheduled for today.
  const todaysFeedings = incompleteFeedings.filter((feeding) =>
    isSameDay(parseFeedingDateForDay(feeding), today)
  );

  // Upcoming Feedings: Feedings scheduled for after today (i.e. tomorrow or later).
  const upcomingFeedings = incompleteFeedings.filter((feeding) => {
    const d = parseFeedingDateForDay(feeding);
    return isAfter(d, today);
  });

  // Debug logs for counts:
  console.log("Late Feedings:", lateFeedings.length);
  console.log("Today's Feedings:", todaysFeedings.length);
  console.log("Upcoming Feedings:", upcomingFeedings.length);

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
    </View>
  );
}
