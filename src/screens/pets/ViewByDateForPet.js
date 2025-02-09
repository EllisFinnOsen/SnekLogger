import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { startOfToday, startOfDay, isSameDay, isAfter } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import { selectAllRecurringFeedings } from "@/redux/selectors/recurringFeedingSelectors";

// Helper function for parsing feeding dates
const parseFeedingDate = (feeding) =>
  startOfDay(new Date(feeding.feedingTimestamp));

export default function ViewByDateForPet({ petId }) {
  const allFeedings = useSelector((state) => state.feedings);
  const recurringFeedings = useSelector(selectAllRecurringFeedings);

  const [feedings, setFeedings] = useState([]);

  /** ✅ Merge, deduplicate, and sort feedings */
  useEffect(() => {
    const mergedFeedings = [...allFeedings, ...recurringFeedings];

    // ✅ Remove duplicates based on `id`
    const uniqueFeedings = Array.from(
      new Map(mergedFeedings.map((f) => [f.id, f])).values()
    );

    // ✅ Sort feedings by timestamp before setting state
    const sortedFeedings = uniqueFeedings.sort(
      (a, b) => parseFeedingDate(a) - parseFeedingDate(b)
    );

    if (JSON.stringify(feedings) !== JSON.stringify(sortedFeedings)) {
      console.log("🔄 Updating Feedings State for Pet...");
      setFeedings(sortedFeedings);
    }
  }, [allFeedings, recurringFeedings]);

  /** ✅ Filter feedings by petId */
  const petFeedings = useMemo(() => {
    return feedings.filter(
      (feeding) => Number(feeding.petId) === Number(petId)
    );
  }, [feedings, petId]);

  /** ✅ Sorting and filtering logic */
  const incompleteFeedings = petFeedings.filter(
    (feeding) => feeding.complete !== 1
  );
  const pastCompletedFeedings = petFeedings.filter(
    (feeding) => feeding.complete === 1
  );

  const today = startOfToday();

  const lateFeedings = incompleteFeedings.filter(
    (feeding) => parseFeedingDate(feeding) < today
  );
  const todaysFeedings = incompleteFeedings.filter((feeding) =>
    isSameDay(parseFeedingDate(feeding), today)
  );
  const upcomingFeedings = incompleteFeedings.filter((feeding) =>
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
      <View style={{ height: 24 }} />

      {/* Late Feedings */}
      {lateFeedings.length > 0 && (
        <FeedingsList
          feedings={lateFeedings}
          title="Late Feedings"
          showAllLink={false}
          noFeedingsText="No late feedings available"
        />
      )}

      {/* Today's Feedings */}
      {firstValidSection === "today" && (
        <FeedingsList
          feedings={modifiedFeedings}
          title="Today's Feedings"
          showAllLink={false}
          noFeedingsText="No feedings scheduled for today"
        />
      )}

      {/* Upcoming Feedings */}
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

      {/* Completed Feedings */}
      {pastCompletedFeedings.length > 0 && (
        <FeedingsList
          feedings={pastCompletedFeedings}
          title="Completed Feedings"
          showAllLink={false}
          noFeedingsText="No past feedings available"
        />
      )}
    </View>
  );
}
