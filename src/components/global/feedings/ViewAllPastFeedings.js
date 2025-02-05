import React from "react";
import { useSelector } from "react-redux";

import { selectPastFeedings } from "@/redux/selectors";
import FeedingsList from "@/components/global/feedings/FeedingsList";

export default function ViewAllPastFeedings() {
  const pastFeedings = useSelector(selectPastFeedings);

  return (
    <FeedingsList
      feedings={pastFeedings}
      title="Past Feedings"
      showAllLink={true}
      noFeedingsText="No past feedings available"
    />
  );
}
