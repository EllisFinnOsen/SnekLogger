import { createSelector } from "reselect";

const recurringFeedingsSelector = (state) => state.recurringFeedings;

// ✅ Return a new array to ensure memoization works correctly
export const selectAllRecurringFeedings = createSelector(
  [recurringFeedingsSelector],
  (recurringFeedings) => (recurringFeedings ? [...recurringFeedings] : [])
);
