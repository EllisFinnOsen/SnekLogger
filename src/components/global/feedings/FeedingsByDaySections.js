import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { startOfToday, isSameDay, isAfter } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import AddLogCard from "@/components/global/feedings/AddLogCard";
import { fetchAllFeedingsfromDB } from "@/redux/actions";

export default function FeedingsByDaySections() {
  const dispatch = useDispatch();
  const allFeedings = useSelector((state) => state.feedings);
  const [feedings, setFeedings] = useState([]);

  useEffect(() => {
    if (allFeedings.length === 0) {
      // If there are no feedings yet, dispatch an action to fetch them.
      dispatch(fetchAllFeedingsfromDB());
    } else {
      setFeedings(allFeedings);
    }
  }, [allFeedings, dispatch]);

  if (feedings.length === 0) {
    return (
      <View>
        <FeedingsList
          feedings={[{ id: "add-log-card" }]} // Always show AddLogCard if no feedings exist
          title="Upcoming Feedings"
          showAllLink={false}
          noFeedingsText="No upcoming feedings available"
        />
      </View>
    );
  }

  // Filter feedings by status
  const incompleteFeedings = feedings.filter(
    (feeding) => feeding.complete === 0
  );

  // Filter completed feedings and sort them newest-to-oldest, then take the most recent 15.
  const pastCompletedFeedings = feedings.filter(
    (feeding) => feeding.complete === 1
  );
  const sortedPastCompletedFeedings = pastCompletedFeedings.sort(
    (a, b) => new Date(b.feedingDate) - new Date(a.feedingDate)
  );
  const limitedPastCompletedFeedings = sortedPastCompletedFeedings.slice(0, 15);

  // Prepare date-based filtering for incomplete feedings
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

  let firstValidSection = null;
  let modifiedFeedings = [];

  if (todaysFeedings.length > 0) {
    firstValidSection = "today";
    modifiedFeedings = [{ id: "add-log-card" }, ...todaysFeedings];
  } else if (upcomingFeedings.length > 0) {
    firstValidSection = "upcoming";
    modifiedFeedings = [{ id: "add-log-card" }, ...upcomingFeedings];
  }

  // Ensure AddLogCard is always shown in "Upcoming Feedings" if no other section has it
  const addLogCardOnly = [{ id: "add-log-card" }];
  const showAddLogCardInUpcoming =
    firstValidSection === null ||
    (lateFeedings.length > 0 && pastCompletedFeedings.length > 0);

  return (
    <View>
      <View style={{ height: 48 }} />

      {/* Render Late Feedings */}
      {lateFeedings.length > 0 && (
        <FeedingsList
          feedings={lateFeedings}
          title="Late Feedings"
          showAllLink={false}
          noFeedingsText="No late feedings available"
        />
      )}

      {/* Render Today's Feedings */}
      {firstValidSection === "today" && (
        <FeedingsList
          feedings={modifiedFeedings}
          title="Today's Feedings"
          showAllLink={false}
          noFeedingsText="No feedings scheduled for today"
        />
      )}

      {/* Render Upcoming Feedings (Always has AddLogCard if no other section does) */}
      {(firstValidSection === "upcoming" || showAddLogCardInUpcoming) && (
        <FeedingsList
          feedings={
            firstValidSection === "upcoming" ? modifiedFeedings : addLogCardOnly
          }
          title="Upcoming Feedings"
          showAllLink={true}
          noFeedingsText="No upcoming feedings available"
        />
      )}

      {/* Render Past Completed Feedings (Most recent 15, sorted newest-to-oldest) */}
      {limitedPastCompletedFeedings.length > 0 && (
        <FeedingsList
          feedings={limitedPastCompletedFeedings}
          title="Completed Feedings"
          showAllLink={false}
          noFeedingsText="No past feedings available"
        />
      )}
    </View>
  );
}
