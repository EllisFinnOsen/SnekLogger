import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { startOfToday, isSameDay, isAfter } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import AddLogCard from "@/components/global/feedings/AddLogCard";
import { fetchAllFeedingsfromDB } from "@/redux/actions";

// Updated helper using feedingTimestamp
import { startOfDay } from "date-fns";
const parseFeedingDate = (feeding) =>
  startOfDay(new Date(feeding.feedingTimestamp));

export default function FeedingsByDaySections() {
  const dispatch = useDispatch();
  const allFeedings = useSelector((state) => state.feedings);
  const [feedings, setFeedings] = useState([]);

  useEffect(() => {
    if (allFeedings.length === 0) {
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

  // Separate incomplete and completed feedings
  const incompleteFeedings = feedings.filter(
    (feeding) => feeding.complete === 0
  );
  const pastCompletedFeedings = feedings.filter(
    (feeding) => feeding.complete === 1
  );

  // Sort completed feedings using parseFeedingDate for consistency.
  const sortedPastCompletedFeedings = [...pastCompletedFeedings].sort(
    (a, b) => {
      const diff = parseFeedingDate(b) - parseFeedingDate(a);
      if (diff !== 0) return diff;
      return String(a.id).localeCompare(String(b.id));
    }
  );
  const limitedPastCompletedFeedings = sortedPastCompletedFeedings.slice(0, 15);

  // Sort incomplete feedings in ascending order (sooner first)
  const sortedIncompleteFeedings = [...incompleteFeedings].sort(
    (a, b) => parseFeedingDate(a) - parseFeedingDate(b)
  );

  const today = startOfToday();

  // Filter incomplete feedings into sections
  const lateFeedings = sortedIncompleteFeedings.filter(
    (feeding) => parseFeedingDate(feeding) < today
  );
  const todaysFeedings = sortedIncompleteFeedings.filter((feeding) =>
    isSameDay(parseFeedingDate(feeding), today)
  );
  const upcomingFeedings = sortedIncompleteFeedings.filter((feeding) =>
    isAfter(parseFeedingDate(feeding), today)
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

  // Always ensure AddLogCard is available if needed
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

      {/* Render Upcoming Feedings */}
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

      {/* Render Past Completed Feedings */}
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
