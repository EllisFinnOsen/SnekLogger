import { createSelector } from 'reselect';

// Input selector: gets the entire feedings array
const feedingsSelector = (state) => state.feedings;

// Memoized selector: filters feedings for a specific pet
export const selectFeedingsByPet = createSelector(
  [feedingsSelector, (_, petId) => petId], // Dependencies
  (feedings, petId) => feedings.filter((feeding) => feeding.petId === petId) // Output calculation
);

export const selectUpcomingFeedings = createSelector(
    [feedingsSelector],
    (feedings) => feedings.filter((feeding) => new Date(feeding.feedingDate) > new Date())
  );
  