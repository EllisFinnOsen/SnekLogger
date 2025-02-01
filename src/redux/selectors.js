import { createSelector } from "reselect";

// Input selector: gets the entire feedings array
const feedingsSelector = (state) => state.feedings;

// Memoized selector: filters feedings for a specific pet
export const selectFeedingsByPet = createSelector(
  [feedingsSelector, (_, petId) => petId], // Dependencies
  (feedings, petId) => feedings.filter((feeding) => feeding.petId === petId) // Output calculation
);

export const selectUpcomingFeedings = createSelector(
  [feedingsSelector],
  (feedings) =>
    feedings.filter((feeding) => new Date(feeding.feedingDate) > new Date())
);

export const selectPastFeedings = createSelector(
  [feedingsSelector],
  (feedings) =>
    feedings.filter((feeding) => new Date(feeding.feedingDate) < new Date())
);

export const selectCompleteFeedings = createSelector(
  [feedingsSelector],
  (feedings) => feedings.filter((feeding) => feeding.complete === 1)
);

export const selectPastCompleteFeedings = createSelector(
  [feedingsSelector],
  (feedings) =>
    feedings
      .filter(
        (feeding) =>
          feeding.complete === 1 && new Date(feeding.feedingDate) < new Date()
      )
      .sort((a, b) => new Date(b.feedingDate) - new Date(a.feedingDate)) // Sort from newest to oldest
);
