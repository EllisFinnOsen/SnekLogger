import React from "react";
import { useSelector } from "react-redux";

import { selectUpcomingFeedings } from "@/redux/selectors";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function ViewAllFeedingsList() {
  const upcomingFeedings = useSelector(selectUpcomingFeedings);

  return (
    <FeedingsList
      feedings={upcomingFeedings}
      title="Upcoming Feedings"
      showAllLink={true}
      noFeedingsText="No upcoming feedings available"
    />
  );
}
