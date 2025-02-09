import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { startOfToday, isSameDay, isAfter, startOfDay } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import AddLogCard from "@/components/global/feedings/AddLogCard";
import { fetchAllFeedingsfromDB } from "@/redux/actions";
import { selectAllRecurringFeedings } from "@/redux/selectors/recurringFeedingSelectors";
import { fetchRecurringFeedingsAction } from "@/redux/actions/recurringFeedingActions";

// Helper function for date parsing
const parseFeedingDate = (feeding) =>
  startOfDay(new Date(feeding.feedingTimestamp || feeding.feedingTime));

export default function FeedingsByDaySections() {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  // Fetch both regular and recurring feedings
  const allFeedings = useSelector((state) => state.feedings);
  const recurringFeedings = useSelector(selectAllRecurringFeedings);

  const [feedings, setFeedings] = useState([]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // Mark fetch as done
      dispatch(fetchAllFeedingsfromDB());
      dispatch(fetchRecurringFeedingsAction());
    }
  }, [dispatch]);

  useEffect(() => {
    setFeedings([...allFeedings, ...recurringFeedings]);
  }, [allFeedings, recurringFeedings]);

  if (feedings.length === 0) {
    return (
      <View>
        <FeedingsList
          feedings={[{ id: "add-log-card" }]}
          title="Upcoming Feedings"
          showAllLink={false}
          noFeedingsText="No upcoming feedings available"
        />
      </View>
    );
  }

  // Separate incomplete and completed feedings
  const incompleteFeedings = feedings.filter(
    (feeding) => feeding.complete !== 1
  );
  const pastCompletedFeedings = feedings.filter(
    (feeding) => feeding.complete === 1
  );

  // Sort completed feedings by date
  const sortedPastCompletedFeedings = [...pastCompletedFeedings].sort(
    (a, b) => parseFeedingDate(b) - parseFeedingDate(a)
  );
  const limitedPastCompletedFeedings = sortedPastCompletedFeedings.slice(0, 15);

  // Sort incomplete feedings in ascending order
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
