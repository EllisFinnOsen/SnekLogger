import React from "react";
import { useSelector } from "react-redux";

import { selectPastCompleteFeedings } from "@/redux/selectors";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function ViewPastCompleteFeedings() {
  const pastCompleteFeedings = useSelector(selectPastCompleteFeedings);

  // Log the past complete feedings to the console
  console.log("Past Complete Feedings:", pastCompleteFeedings);

  return (
    <FeedingsList
      feedings={pastCompleteFeedings}
      title="Complete Feedings"
      showAllLink={true}
      noFeedingsText="No Past or Complete feedings available"
    />
  );
}
