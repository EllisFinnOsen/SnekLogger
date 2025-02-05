// selectors.js
import { createSelector } from "reselect";
import { startOfToday } from "date-fns";

// Define a constant empty array to avoid creating new arrays on each call.
const EMPTY_ARRAY = [];

// Input selector: gets the entire feedings array
const feedingsSelector = (state) => state.feedings;
const userProfileSelector = (state) => state.user.profile;
// Freezer inventory selector
const freezerSelector = (state) =>
  state.freezer || { items: [], lowStockWarnings: [] };

export const selectUserProfile = createSelector(
  [userProfileSelector],
  (profile) => profile || { name: "", photo: "", birthdate: "" }
);

// Memoized selector: filters feedings for a specific pet
export const selectFeedingsByPet = createSelector(
  [feedingsSelector, (_, petId) => Number(petId)],
  (feedings, petId) => {
    const result = feedings.filter(
      (feeding) => Number(feeding.petId) === petId
    );
    console.log("selectFeedingsByPet:", { petId, result });
    return result;
  }
);

// File: selectors.js
export const selectFeedingById = createSelector(
  [feedingsSelector, (_, feedingId) => Number(feedingId)],
  (feedings, feedingId) => {
    const feeding = feedings.find(
      (feeding) => Number(feeding.id) === feedingId
    );
    console.log("selectFeedingById:", { feedingId, feeding });
    return feeding || null; // Ensure it returns null if not found
  }
);

// Selector to filter upcoming and incomplete feedings, then sort them by feedingDate (soonest first)
// Now we use a fixed reference date (startOfToday) so that the computed result is stable.
export const selectUpcomingFeedings = createSelector(
  [feedingsSelector],
  (feedings) => {
    const today = startOfToday();
    const filtered = feedings.filter(
      (feeding) =>
        new Date(feeding.feedingDate) > today && feeding.complete === 0
    );
    // Clone before sorting so that we don’t mutate the filtered array.
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.feedingDate) - new Date(b.feedingDate)
    );

    // Simple caching: if lastResult exists and is shallowly equal by id, return it.
    if (
      selectUpcomingFeedings.lastResult &&
      selectUpcomingFeedings.lastResult.length === sorted.length &&
      selectUpcomingFeedings.lastResult.every(
        (item, index) => item.id === sorted[index].id
      )
    ) {
      return selectUpcomingFeedings.lastResult;
    }
    // Cache the new result
    selectUpcomingFeedings.lastResult = sorted;
    console.log("selectUpcomingFeedings:", sorted);
    return sorted;
  }
);

// Selector to get the groupPets slice from state.
// Use EMPTY_ARRAY so that if state.groupPets[groupId] is undefined,
// you always return the same empty array reference.
const selectGroupPetsByGroupId = (state, groupId) =>
  state.groupPets[groupId] || EMPTY_ARRAY;

// Create a memoized selector for groupPets using a factory function
export const makeSelectGroupPets = () =>
  createSelector([selectGroupPetsByGroupId], (pets) => {
    console.log("makeSelectGroupPets: pets reference", pets);
    return pets;
  });

// Selector to get the groups array from state
const selectAllGroups = (state) => state.groups.groups;

// Selector to get the groupId (passed as a prop)
const selectGroupId = (_, groupId) => groupId;

// Create a memoized selector to find a group by ID
export const selectGroupById = createSelector(
  [selectAllGroups, selectGroupId],
  (groups, groupId) => {
    const result = groups.find((g) => g.id === groupId);
    console.log("selectGroupById:", { groupId, result });
    return result;
  }
);

// Selector to find a freezer item by ID
export const selectFreezerItemById = createSelector(
  [freezerSelector, (_, freezerId) => freezerId],
  (freezer, freezerId) => freezer.find((item) => item.id === freezerId) || null
);

// Selector to get all feeding-freezer links
const feedingFreezerSelector = (state) => state.feedingFreezer || {};

// Selector to get linked freezer items for a feeding
export const selectFeedingFreezerLinks = createSelector(
  [feedingFreezerSelector, (_, feedingId) => feedingId],
  (feedingFreezer, feedingId) => feedingFreezer[feedingId] || []
);

// Selector to get all freezer items
export const selectFreezerItems = (state) => state.freezer.items || []; // ✅ Ensure array

// Selector to get low stock warnings
export const selectLowStockWarnings = createSelector(
  [freezerSelector],
  (freezer) => freezer.lowStockWarnings
);
