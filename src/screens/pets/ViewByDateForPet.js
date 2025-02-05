// ViewByDateForPet.js
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { startOfToday, isSameDay, isAfter } from "date-fns";
import FeedingsList from "@/components/global/feedings/FeedingsList";
import AddLogCard from "@/components/global/feedings/AddLogCard";

export default function ViewByDateForPet({ petId }) {
  const allFeedings = useSelector((state) => state.feedings);
  const petFeedings = allFeedings.filter(
    (feeding) => Number(feeding.petId) === Number(petId)
  );

  const incompleteFeedings = petFeedings.filter(
    (feeding) => feeding.complete === 0
  );
  const pastCompleteFeedings = petFeedings.filter(
    (feeding) => feeding.complete === 1
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

  const allFeedingsCompleted = incompleteFeedings.length === 0;

  let firstValidSection = null;
  let modifiedFeedings = [];

  if (todaysFeedings.length > 0) {
    firstValidSection = "today";
    modifiedFeedings = [{ id: "add-log-card" }, ...todaysFeedings];
  } else if (upcomingFeedings.length > 0) {
    firstValidSection = "upcoming";
    modifiedFeedings = [{ id: "add-log-card" }, ...upcomingFeedings];
  }

  if (petFeedings.length === 0) {
    firstValidSection = "upcoming";
    modifiedFeedings = [{ id: "add-log-card" }];
  }

  return (
    <View>
      <View style={{ height: 48 }}></View>

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

      {firstValidSection === "upcoming" && (
        <FeedingsList
          feedings={modifiedFeedings}
          title="Upcoming Feedings"
          showAllLink={true}
          noFeedingsText="No upcoming feedings available"
        />
      )}

      {pastCompleteFeedings.length > 0 && (
        <FeedingsList
          feedings={
            allFeedingsCompleted
              ? [{ id: "add-log-card" }, ...pastCompleteFeedings]
              : pastCompleteFeedings
          }
          title="Completed Feedings"
          showAllLink={false}
          noFeedingsText="No past feedings available"
        />
      )}
    </View>
  );
}
