import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { startOfToday, isSameDay, isAfter } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import AddLogCard from "@/components/global/feedings/AddLogCard";

export default function FeedingsByDaySections() {
  const allFeedings = useSelector((state) => state.feedings);

  // Separate completed and incomplete feedings
  const incompleteFeedings = allFeedings.filter(
    (feeding) => feeding.complete === 0
  );
  const pastCompletedFeedings = allFeedings.filter(
    (feeding) =>
      feeding.complete === 1 &&
      new Date(`${feeding.feedingDate}T00:00:00`) > startOfToday()
  );

  const today = startOfToday();
  const parseFeedingDateForDay = (feeding) =>
    new Date(`${feeding.feedingDate}T00:00:00`);

  const lateFeedings = incompleteFeedings.filter(
    (feeding) => parseFeedingDateForDay(feeding) < today
  );
  const todaysFeedings = incompleteFeedings.filter((feeding) =>
    isSameDay(parseFeedingDateForDay(feeding), today)
  );
  const upcomingFeedings = incompleteFeedings.filter((feeding) =>
    isAfter(parseFeedingDateForDay(feeding), today)
  );

  // Determine if all feedings are complete
  const allFeedingsCompleted = incompleteFeedings.length === 0;

  // Determine where to insert AddLogCard (first valid section excluding Late Feedings)
  let firstValidSection = null;
  let modifiedFeedings = [];

  if (todaysFeedings.length > 0) {
    firstValidSection = "today";
    modifiedFeedings = [{ id: "add-log-card" }, ...todaysFeedings];
  } else if (upcomingFeedings.length > 0) {
    firstValidSection = "upcoming";
    modifiedFeedings = [{ id: "add-log-card" }, ...upcomingFeedings];
  }

  return (
    <View>
      <View style={{ height: 48 }}></View>
      {/* Render Late Feedings without AddLogCard */}
      {lateFeedings.length > 0 && (
        <FeedingsList
          feedings={lateFeedings}
          title="Late Feedings"
          showAllLink={false}
          noFeedingsText="No late feedings available"
        />
      )}

      {/* Render Today's Feedings with AddLogCard if it's the first valid section */}
      {firstValidSection === "today" && (
        <FeedingsList
          feedings={modifiedFeedings}
          title="Today's Feedings"
          showAllLink={false}
          noFeedingsText="No feedings scheduled for today"
        />
      )}

      {/* Render Upcoming Feedings with AddLogCard if it's the first valid section */}
      {firstValidSection === "upcoming" && (
        <FeedingsList
          feedings={modifiedFeedings}
          title="Upcoming Feedings"
          showAllLink={true}
          noFeedingsText="No upcoming feedings available"
        />
      )}

      {/* Render Past Completed Feedings with AddLogCard if ALL feedings are completed */}
      {pastCompletedFeedings.length > 0 && (
        <FeedingsList
          feedings={
            allFeedingsCompleted
              ? [{ id: "add-log-card" }, ...pastCompletedFeedings]
              : pastCompletedFeedings
          }
          title="Completed Feedings"
          showAllLink={false}
          noFeedingsText="No past feedings available"
        />
      )}
    </View>
  );
}
