import React from "react";
import { useSelector } from "react-redux";

import { selectFeedingsByPet } from "../../../redux/selectors";
import FeedingsList from "./feedings/FeedingsList";

export default function ViewPetProfileFeedings({ petId }) {
  const feedings = useSelector((state) => selectFeedingsByPet(state, petId));

  return (
    <FeedingsList
      feedings={feedings}
      noFeedingsText="No feedings available for this pet."
      // If you want a title or a showAllLink here, you can also pass them:
      // title="Feedings For This Pet"
      // showAllLink={false}
    />
  );
}
