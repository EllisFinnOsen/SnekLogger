import React from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { startOfToday, isSameDay, isAfter, startOfDay } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import AddLogCard from "@/components/global/feedings/AddLogCard";
import { fetchFeedings } from "@/redux/actions";

export default function FeedingsByDaySections() {
  const allFeedings = useSelector((state) => state.feedings);
  console.log(
    "FeedingsByDaySections re-render, feedings count:",
    allFeedings.length
  );
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      // Refetch feedings when this screen is focused
      dispatch(fetchFeedings());
    }, [dispatch])
  );

  // Separate completed and incomplete feedings
  const incompleteFeedings = allFeedings.filter(
    (feeding) => feeding.complete === 0
  );
  const pastCompletedFeedings = allFeedings.filter(
    (feeding) => feeding.complete === 1
  );

  const today = startOfToday();

  // Updated parsing function that uses the stored ISO date directly
  const parseFeedingDateForDay = (feeding) => {
    const d = new Date(feeding.feedingDate);
    console.log("Parsed feeding date:", feeding.feedingDate, "=>", d);
    return startOfDay(d);
  };

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

  // NEW: If there are absolutely no feedings, force the Upcoming section
  if (allFeedings.length === 0) {
    firstValidSection = "upcoming";
    modifiedFeedings = [{ id: "add-log-card" }];
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
