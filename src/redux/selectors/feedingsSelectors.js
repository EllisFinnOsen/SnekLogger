import { createSelector } from "reselect";
import { startOfToday } from "date-fns";

const feedingsSelector = (state) => state.feedings;

// Memoized selector: filters feedings for a specific pet
export const selectFeedingsByPet = createSelector(
  [feedingsSelector, (_, petId) => Number(petId)],
  (feedings, petId) => {
    const result = feedings.filter(
      (feeding) => Number(feeding.petId) === petId
    );
    //console.log("selectFeedingsByPet:", { petId, result });
    return result;
  }
);

export const selectFeedingById = createSelector(
  [feedingsSelector, (_, feedingId) => Number(feedingId)],
  (feedings, feedingId) => {
    const feeding = feedings.find(
      (feeding) => Number(feeding.id) === feedingId
    );
    //console.log("selectFeedingById:", { feedingId, feeding });
    return feeding || null;
  }
);

export const selectUpcomingFeedings = createSelector(
  [feedingsSelector],
  (feedings) => {
    const today = startOfToday();
    const filtered = feedings.filter(
      (feeding) =>
        new Date(feeding.feedingDate) > today && feeding.complete === 0
    );
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.feedingDate) - new Date(b.feedingDate)
    );

    if (
      selectUpcomingFeedings.lastResult &&
      selectUpcomingFeedings.lastResult.length === sorted.length &&
      selectUpcomingFeedings.lastResult.every(
        (item, index) => item.id === sorted[index].id
      )
    ) {
      return selectUpcomingFeedings.lastResult;
    }

    selectUpcomingFeedings.lastResult = sorted;
    //console.log("selectUpcomingFeedings:", sorted);
    return sorted;
  }
);
