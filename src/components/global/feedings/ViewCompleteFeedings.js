import React from "react";
import { useSelector } from "react-redux";

import { selectCompleteFeedings } from "@/redux/selectors/selectors";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function ViewAllCompleteFeedings() {
  const completeFeedings = useSelector(selectCompleteFeedings);

  return (
    <FeedingsList
      feedings={completeFeedings}
      title="Complete Feedings"
      showAllLink={true}
      noFeedingsText="No Complete feedings available"
    />
  );
}
