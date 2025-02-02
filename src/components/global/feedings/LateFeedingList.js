// LateFeedingsList.js
import React from "react";
import { useSelector } from "react-redux";

import { selectLateFeedings } from "@/redux/selectors";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function LateFeedingsList() {
  const lateFeedings = useSelector(selectLateFeedings);

  return (
    <FeedingsList
      feedings={lateFeedings}
      title="Late Feedings"
      showAllLink={true}
      noFeedingsText="No late feedings available"
    />
  );
}
