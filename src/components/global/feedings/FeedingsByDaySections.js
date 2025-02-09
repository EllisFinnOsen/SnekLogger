import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { startOfToday, isSameDay, isAfter, startOfDay } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import { fetchAllFeedingsfromDB } from "@/redux/actions";
import { selectAllRecurringFeedings } from "@/redux/selectors/recurringFeedingSelectors";
import { fetchRecurringFeedingsAction } from "@/redux/actions/recurringFeedingActions";

// Helper function for parsing feeding dates
const parseFeedingDate = (feeding) =>
  startOfDay(new Date(feeding.feedingTimestamp));

export default function FeedingsByDaySections() {
  const dispatch = useDispatch();

  const allFeedings = useSelector((state) => state.feedings);
  const recurringFeedings = useSelector(selectAllRecurringFeedings);

  const [feedings, setFeedings] = useState([]);

  /** ✅ Dispatch actions only on first mount */
  useEffect(() => {
    if (allFeedings.length === 0) {
      console.log("🚀 Fetching Regular Feedings...");
      dispatch(fetchAllFeedingsfromDB());
    }

    if (recurringFeedings.length === 0) {
      console.log("🚀 Fetching Recurring Feedings...");
      dispatch(fetchRecurringFeedingsAction());
    }
  }, []); // ✅ Runs only on mount

  /** ✅ Merge feedings and remove duplicates */
  useEffect(() => {
    const mergedFeedings = [...allFeedings, ...recurringFeedings];

    // ✅ Remove duplicates based on the `id`
    const uniqueFeedings = Array.from(
      new Map(mergedFeedings.map((f) => [f.id, f])).values()
    );

    if (JSON.stringify(feedings) !== JSON.stringify(uniqueFeedings)) {
      console.log("🔄 Updating Feedings State...");
      setFeedings(uniqueFeedings);
    }
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

  /** ✅ Sorting and filtering logic */
  const incompleteFeedings = feedings.filter(
    (feeding) => feeding.complete !== 1
  );
  const pastCompletedFeedings = feedings.filter(
    (feeding) => feeding.complete === 1
  );

  const sortedPastCompletedFeedings = [...pastCompletedFeedings].sort(
    (a, b) => parseFeedingDate(b) - parseFeedingDate(a)
  );
  const limitedPastCompletedFeedings = sortedPastCompletedFeedings.slice(0, 15);

  const sortedIncompleteFeedings = [...incompleteFeedings].sort(
    (a, b) => parseFeedingDate(a) - parseFeedingDate(b)
  );

  const today = startOfToday();

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

      {lateFeedings.length > 0 && (
        <FeedingsList
          feedings={lateFeedings}
          title="Late Feedings"
          showAllLink={false}
          noFeedingsText="No late feedings available"
        />
      )}

      {firstValidSection === "today" && (
        <FeedingsList
          feedings={modifiedFeedings}
          title="Today's Feedings"
          showAllLink={false}
          noFeedingsText="No feedings scheduled for today"
        />
      )}

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
